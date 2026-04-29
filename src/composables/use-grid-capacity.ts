import {
  ref,
  computed,
  toValue,
  onMounted,
  onBeforeUnmount,
  type Ref,
  type ComputedRef,
  type CSSProperties,
  type MaybeRefOrGetter
} from 'vue'

type UseGridCapacityOptions = {
  bounds: Ref<HTMLElement | null>
  // CSS-style ratio: width / height. Pass `7/8` for a card that is `aspect-card`.
  aspect_ratio: MaybeRefOrGetter<number>
  min_width: MaybeRefOrGetter<number>
  // upper bound for item width; defaults to Infinity (no cap)
  max_width?: MaybeRefOrGetter<number>
  gap?: MaybeRefOrGetter<number>
  // scoring knobs
  v_weight?: MaybeRefOrGetter<number>
  h_weight?: MaybeRefOrGetter<number>
  score_form?: MaybeRefOrGetter<'max' | 'sum'>
  capacity_bonus?: MaybeRefOrGetter<number>
}

type UseGridCapacityResult = {
  cols: ComputedRef<number>
  rows: ComputedRef<number>
  capacity: ComputedRef<number>
  item_width: ComputedRef<number>
  item_height: ComputedRef<number>
  bounds_width: Ref<number>
  bounds_height: Ref<number>
  gridStyle: ComputedRef<CSSProperties>
}

/**
 * Solves for the row × column layout that fills the given `bounds` height
 * with same-size items at the supplied aspect ratio, keeping each item's
 * width in the `[min_width, max_width]` range. Items render at exact pixel
 * sizes via `gridStyle`; aspect is preserved.
 *
 * The solver picks the largest row count whose height-derived item width
 * still satisfies `min_width`. When the height-derived width would exceed
 * `max_width`, it clamps to `max_width` (vertical slack remains until row
 * count grows enough to bring item width back below the cap).
 *
 * Only `bounds` is observed for resize. Grid mutations and child sizing
 * are ignored.
 *
 * @example
 * const wrapper = useTemplateRef<HTMLElement>('wrapper')
 * const { cols, rows, gridStyle } = useGridCapacity({
 *   bounds: wrapper,
 *   aspect_ratio: 7 / 8,
 *   min_width: 160,
 *   max_width: 320,
 *   gap: 12
 * })
 */
export function useGridCapacity({
  bounds,
  aspect_ratio: aspectOpt,
  min_width: minWidthOpt,
  max_width: maxWidthOpt,
  gap: gapOpt = 0,
  v_weight: vWeightOpt = 1.5,
  h_weight: hWeightOpt = 1,
  score_form: scoreFormOpt = 'max',
  capacity_bonus: capacityBonusOpt = 0
}: UseGridCapacityOptions): UseGridCapacityResult {
  const aspect = computed(() => toValue(aspectOpt))
  const min_width = computed(() => toValue(minWidthOpt))
  const max_width = computed(() => (maxWidthOpt === undefined ? Infinity : toValue(maxWidthOpt)))
  const gap = computed(() => toValue(gapOpt))
  const v_weight = computed(() => toValue(vWeightOpt))
  const h_weight = computed(() => toValue(hWeightOpt))
  const score_form = computed(() => toValue(scoreFormOpt))
  const capacity_bonus = computed(() => toValue(capacityBonusOpt))

  const bounds_width = ref(0)
  const bounds_height = ref(0)

  function measure() {
    const el = bounds.value
    if (!el) return

    bounds_width.value = el.clientWidth
    bounds_height.value = el.clientHeight
  }

  let observer: ResizeObserver | undefined

  onMounted(() => {
    measure()
    if (!bounds.value) return

    // Read sizes from the entry's borderBoxSize rather than calling
    // clientWidth again — the latter can lag a frame behind the actual resize
    // (produces "stuck large cards" after a shrink → grow sequence). Prefer
    // borderBoxSize over contentRect: contentRect can be fractional and
    // ~0.5px under the rendered box width, which silently drops a column.
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.borderBoxSize?.[0]
        bounds_width.value = box ? box.inlineSize : entry.contentRect.width
        bounds_height.value = box ? box.blockSize : entry.contentRect.height
      }
    })
    observer.observe(bounds.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  const layout = computed(() => {
    const W = bounds_width.value
    const H = bounds_height.value
    const a = aspect.value
    const min_w = min_width.value
    const max_w = max_width.value
    const g = gap.value

    if (!W || !H || !a || !min_w) {
      return { cols: 0, rows: 0, item_w: 0, item_h: 0 }
    }

    return solve({
      W,
      H,
      aspect: a,
      min_w,
      max_w,
      g,
      v_weight: v_weight.value,
      h_weight: h_weight.value,
      score_form: score_form.value,
      capacity_bonus: capacity_bonus.value
    })
  })

  const cols = computed(() => layout.value.cols)
  const rows = computed(() => layout.value.rows)
  const capacity = computed(() => cols.value * rows.value)
  const item_width = computed(() => layout.value.item_w)
  const item_height = computed(() => layout.value.item_h)

  const gridStyle = computed<CSSProperties>(() => {
    const { cols: c, item_w, item_h } = layout.value
    if (c === 0 || item_w === 0) return { display: 'grid' }

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${c}, minmax(0, ${item_w}px))`,
      gridAutoRows: `${item_h}px`,
      gap: `${gap.value}px`,
      justifyContent: 'center'
    }
  })

  return { cols, rows, capacity, item_width, item_height, bounds_width, bounds_height, gridStyle }
}

type SolveArgs = {
  W: number
  H: number
  aspect: number
  min_w: number
  max_w: number
  g: number
  v_weight: number
  h_weight: number
  score_form: 'max' | 'sum'
  capacity_bonus: number
}

function solve({
  W,
  H,
  aspect,
  min_w,
  max_w,
  g,
  v_weight,
  h_weight,
  score_form,
  capacity_bonus
}: SolveArgs) {
  // Search the (cols, rows) grid. Item width is the smaller of the width-
  // derived and height-derived candidates so the aspect-locked card fits
  // in both axes. Score combines the two weighted slack ratios via either
  // max() or sum, then subtracts a capacity bonus so the caller can bias
  // toward more cards on the page.
  let best = {
    cols: 1,
    rows: 1,
    item_w: 0,
    item_h: 0,
    score: Infinity
  }

  for (let cols = 1; cols <= 30; cols++) {
    const item_w_from_w = (W - (cols - 1) * g) / cols
    if (item_w_from_w < min_w) break

    for (let rows = 1; rows <= 30; rows++) {
      const item_h_from_h = (H - (rows - 1) * g) / rows
      if (item_h_from_h <= 0) break

      const item_w_from_h = item_h_from_h * aspect
      const fit_w = Math.min(item_w_from_w, item_w_from_h)
      if (fit_w < min_w) break

      const item_w = Math.floor(Math.min(fit_w, max_w))
      const item_h = Math.floor(item_w / aspect)

      const v_slack = (H - (rows * item_h + (rows - 1) * g)) / H
      const h_slack = (W - (cols * item_w + (cols - 1) * g)) / W

      const v = v_weight * v_slack
      const h = h_weight * h_slack
      const base = score_form === 'sum' ? v + h : Math.max(v, h)
      const score = base - capacity_bonus * cols * rows

      const better =
        score < best.score || (score === best.score && cols + rows < best.cols + best.rows)

      if (better) best = { cols, rows, item_w, item_h, score }
    }
  }

  return best
}

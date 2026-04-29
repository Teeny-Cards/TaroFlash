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
  grid: Ref<HTMLElement | null>
  // when omitted, row count is bounded by the grid's own clientHeight
  bounds?: Ref<HTMLElement | null>
  trackMin: MaybeRefOrGetter<number>
  gap?: MaybeRefOrGetter<number>
  // when true, picks the column count that minimises bottom whitespace by
  // shrinking items uniformly (preserving CSS aspect-ratio); gridStyle
  // becomes `repeat(<cols>, 1fr)`. when false (default), uses auto-fit and
  // rows is derived from the measured item height.
  fit?: MaybeRefOrGetter<boolean>
  // absolute px floor below which fit-mode won't shrink items. takes
  // precedence over fitFloor. when unset, falls back to trackMin * fitFloor.
  trackFloor?: MaybeRefOrGetter<number>
  // fractional fallback floor when trackFloor isn't set (default 0.6)
  fitFloor?: MaybeRefOrGetter<number>
}

type UseGridCapacityResult = {
  gridStyle: ComputedRef<CSSProperties>
  cols: ComputedRef<number>
  rows: ComputedRef<number>
  capacity: ComputedRef<number>
  trackMin: ComputedRef<number>
  gap: ComputedRef<number>
  // 0 until first child mounts — measured from firstElementChild
  itemHeight: Ref<number>
}

/**
 * Reactive grid layout + capacity. Owns the grid's track definition and gaps
 * so measurements and styling read from a single source.
 *
 * Two layout modes:
 * - **auto-fit (default)**: `repeat(auto-fit, minmax(trackMin, 1fr))`. Cols
 *   grow with width; rows is whatever fits in `bounds`. Whitespace at the
 *   bottom is whatever it is.
 * - **fit (`fit: true`)**: searches for a column count that minimises bottom
 *   whitespace by shrinking items uniformly (preserving CSS aspect-ratio).
 *   Items shrink down to `trackMin * fitFloor` (default 0.6) before the
 *   search stops. gridStyle becomes `repeat(<cols>, 1fr)`.
 *
 * @example
 * const grid = useTemplateRef<HTMLElement>('grid')
 * const viewport = useTemplateRef<HTMLElement>('viewport')
 * const isMd = useMediaQuery('md')
 *
 * const { gridStyle, cols, rows, capacity } = useGridCapacity({
 *   grid,
 *   bounds: viewport,
 *   trackMin: 192,
 *   gap: 16,
 *   fit: () => isMd.value
 * })
 */
export function useGridCapacity({
  grid,
  bounds,
  trackMin: trackMinOpt,
  gap: gapOpt = 0,
  fit: fitOpt = false,
  trackFloor: trackFloorOpt,
  fitFloor: fitFloorOpt = 0.6
}: UseGridCapacityOptions): UseGridCapacityResult {
  const trackMin = computed(() => toValue(trackMinOpt))
  const gap = computed(() => toValue(gapOpt))
  const fit = computed(() => toValue(fitOpt))
  const fitFloor = computed(() => toValue(fitFloorOpt))
  const trackFloor = computed(() => {
    const explicit = trackFloorOpt === undefined ? undefined : toValue(trackFloorOpt)
    return explicit ?? trackMin.value * fitFloor.value
  })

  const gridWidth = ref(0)
  const boundsHeight = ref(0)
  const itemWidth = ref(0)
  const itemHeight = ref(0)

  function measure() {
    const el = grid.value
    if (!el) return

    gridWidth.value = el.clientWidth

    const style = getComputedStyle(el)
    const grid_pad_y = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
    boundsHeight.value = (bounds?.value ?? el).clientHeight - grid_pad_y

    const first = el.firstElementChild as HTMLElement | null
    if (first) {
      itemWidth.value = first.offsetWidth
      itemHeight.value = first.offsetHeight
    }
  }

  let gridObserver: ResizeObserver | undefined
  let boundsObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined

  onMounted(() => {
    measure()

    gridObserver = new ResizeObserver(measure)
    if (grid.value) gridObserver.observe(grid.value)

    if (bounds?.value && bounds.value !== grid.value) {
      boundsObserver = new ResizeObserver(measure)
      boundsObserver.observe(bounds.value)
    }

    if (grid.value) {
      mutationObserver = new MutationObserver(measure)
      mutationObserver.observe(grid.value, { childList: true })
    }
  })

  onBeforeUnmount(() => {
    gridObserver?.disconnect()
    boundsObserver?.disconnect()
    mutationObserver?.disconnect()
  })

  const layout = computed(() => {
    const w = gridWidth.value
    const min = trackMin.value
    const g = gap.value
    if (!w || !min) return { cols: 0, rows: 0 }

    const naive_cols = Math.max(1, Math.floor((w + g) / (min + g)))

    const h = boundsHeight.value
    const iw = itemWidth.value
    const ih = itemHeight.value

    if (!fit.value || !h || !iw || !ih) {
      // fall back to naive cols + measured-item rows
      const rows = ih ? Math.max(1, Math.floor((h + g) / (ih + g))) : 0
      return { cols: naive_cols, rows }
    }

    const aspect = ih / iw
    const w_floor = trackFloor.value

    let best = { cols: naive_cols, rows: 1, slack: Infinity }
    for (let n = naive_cols; n <= naive_cols + 6; n++) {
      const item_w = (w - (n - 1) * g) / n
      if (item_w < w_floor) break
      const item_h = item_w * aspect
      const rows = Math.max(1, Math.floor((h + g) / (item_h + g)))
      const used = rows * item_h + (rows - 1) * g
      const slack = h - used
      if (slack < best.slack) best = { cols: n, rows, slack }
    }
    return { cols: best.cols, rows: best.rows }
  })

  const cols = computed(() => layout.value.cols)
  const rows = computed(() => layout.value.rows)
  const capacity = computed(() => cols.value * rows.value)

  const gridStyle = computed<CSSProperties>(() => {
    if (fit.value && cols.value > 0) {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
        gap: `${gap.value}px`
      }
    }
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${trackMin.value}px, 1fr))`,
      gap: `${gap.value}px`
    }
  })

  return { gridStyle, cols, rows, capacity, trackMin, gap, itemHeight }
}

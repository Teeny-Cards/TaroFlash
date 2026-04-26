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
 * Reactive grid layout + capacity. The composable owns the grid's track
 * definition and gaps so measurements and styling read from a single source —
 * no duplication between Tailwind utilities and JS literals.
 *
 * Returns a `gridStyle` to bind on the grid element. Inline style is used
 * (rather than utility classes) because Tailwind's JIT can't pre-generate
 * arbitrary `grid-cols-[...]` values built from a runtime config.
 *
 * `trackMin` and `gap` accept any `MaybeRefOrGetter<number>` — pass a number,
 * ref, or getter. Responsive behaviour is the caller's concern (build a
 * getter that reads `useMediaQuery` or any other signal).
 *
 * @example
 * const grid = useTemplateRef<HTMLElement>('grid')
 * const viewport = useTemplateRef<HTMLElement>('viewport')
 * const isSm = useMediaQuery('sm')
 * const isMd = useMediaQuery('md')
 *
 * const { gridStyle, cols, rows, capacity } = useGridCapacity({
 *   grid,
 *   bounds: viewport,
 *   trackMin: () => (isSm.value ? 192 : 176),
 *   gap: () => (isMd.value ? 16 : 8)
 * })
 */
export function useGridCapacity({
  grid,
  bounds,
  trackMin: trackMinOpt,
  gap: gapOpt = 0
}: UseGridCapacityOptions): UseGridCapacityResult {
  const trackMin = computed(() => toValue(trackMinOpt))
  const gap = computed(() => toValue(gapOpt))

  const gridWidth = ref(0)
  const boundsHeight = ref(0)
  const itemHeight = ref(0)

  function measure() {
    const el = grid.value
    if (!el) return

    gridWidth.value = el.clientWidth
    boundsHeight.value = (bounds?.value ?? el).clientHeight

    const first = el.firstElementChild as HTMLElement | null
    if (first) itemHeight.value = first.offsetHeight
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

  const gridStyle = computed<CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${trackMin.value}px, 1fr))`,
    gap: `${gap.value}px`
  }))

  const cols = computed(() => {
    const w = gridWidth.value
    const min = trackMin.value
    if (!w || !min) return 0
    return Math.max(1, Math.floor((w + gap.value) / (min + gap.value)))
  })

  const rows = computed(() => {
    const h = boundsHeight.value
    const ih = itemHeight.value
    if (!h || !ih) return 0
    return Math.max(1, Math.floor((h + gap.value) / (ih + gap.value)))
  })

  const capacity = computed(() => cols.value * rows.value)

  return { gridStyle, cols, rows, capacity, trackMin, gap, itemHeight }
}

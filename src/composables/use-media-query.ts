import { ref, onMounted, onUnmounted, type Ref } from 'vue'

type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type PointerKey = 'coarse' | 'fine'

let styles = getComputedStyle(document.documentElement)

const BREAKPOINTS: Record<BreakpointKey, string> = {
  sm: styles.getPropertyValue('--breakpoint-sm'),
  md: styles.getPropertyValue('--breakpoint-md'),
  lg: styles.getPropertyValue('--breakpoint-lg'),
  xl: styles.getPropertyValue('--breakpoint-xl'),
  '2xl': styles.getPropertyValue('--breakpoint-2xl')
}

const POINTER: Record<PointerKey, string> = {
  coarse: '(pointer: coarse)',
  fine: '(pointer: fine)'
}

function toMediaQuery(input: string) {
  const q = input.trim()

  if (q in BREAKPOINTS) {
    return `(min-width: ${BREAKPOINTS[q as BreakpointKey]})`
  }
  if (q in POINTER) {
    return POINTER[q as PointerKey]
  }

  return q // string query
}

const cache = new Map<
  string,
  { ref: Ref<boolean>; mq: MediaQueryList; count: number; handler: () => void }
>()

export function useMediaQuery(breakpoint: BreakpointKey | PointerKey) {
  const query = toMediaQuery(breakpoint)

  let entry = cache.get(query)

  if (!entry) {
    const r = ref(false)

    entry = {
      ref: r,
      mq: window.matchMedia(query),
      count: 0,
      handler: () => (r.value = entry!.mq.matches)
    }

    cache.set(query, entry)
    entry.mq.addEventListener('change', entry.handler)
  }

  entry.count++

  onUnmounted(() => {
    const e = cache.get(query)
    if (!e) return
    e.count--
    if (e.count <= 0) {
      e.mq.removeEventListener('change', e.handler)
      cache.delete(query)
    }
  })

  onMounted(() => {
    const e = cache.get(query)
    if (e) e.ref.value = e.mq.matches
  })

  return entry.ref
}

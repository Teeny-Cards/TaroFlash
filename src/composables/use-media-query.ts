import { ref, computed, type Ref } from 'vue'

export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type PointerKey = 'coarse' | 'fine'
type ColorSchemeKey = 'light' | 'dark'

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

const COLOR_SCHEME: Record<ColorSchemeKey, string> = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)'
}

function toMediaQuery(input: string) {
  const q = input.trim()

  if (q in BREAKPOINTS) {
    return `(min-width: ${BREAKPOINTS[q as BreakpointKey]})`
  }
  if (q in POINTER) {
    return POINTER[q as PointerKey]
  }
  if (q in COLOR_SCHEME) {
    return COLOR_SCHEME[q as ColorSchemeKey]
  }

  return q // string query
}

// App-lifetime cache. matchMedia listeners are permanent and shared across all
// callers — no refcount, no component lifecycle. Safe to call from any context
// (setup, render, transition hooks). One listener per unique query string.
const cache = new Map<string, Ref<boolean>>()

export function useMediaQuery(breakpoint: BreakpointKey | PointerKey | ColorSchemeKey) {
  const query = toMediaQuery(breakpoint)

  let r = cache.get(query)
  if (r) return r

  const mq = window.matchMedia(query)
  r = ref(mq.matches)
  mq.addEventListener('change', () => (r!.value = mq.matches))
  cache.set(query, r)

  return r
}

/**
 * Reactive boolean — true when viewport width is below `width_key` OR
 * height is below `height_key`. Independent thresholds; either can trigger.
 */
export function useMobileBreakpoint(
  width_key: BreakpointKey = 'sm',
  height_key: BreakpointKey = 'sm'
) {
  const width_value = BREAKPOINTS[width_key]
  const height_value = BREAKPOINTS[height_key]
  // Use the L3 'not all and (min-...)' form. This is exactly what Tailwind's
  // `max-sm:` variant emits and is supported on every mobile Safari version.
  // Avoids `calc()` (Safari parser bugs) and bare `not (...)` (L4 syntax).
  const below_width = useMediaQuery(`not all and (min-width: ${width_value})` as BreakpointKey)
  const below_height = useMediaQuery(`not all and (min-height: ${height_value})` as BreakpointKey)

  return computed(() => below_width.value || below_height.value)
}

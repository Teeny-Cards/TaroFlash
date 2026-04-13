import { computed, ref } from 'vue'
import { useStorage } from '@/composables/use-storage'
import { useMediaQuery } from '@/composables/use-media-query'

export type ThemeMode = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'app-theme'
const mode = ref<ThemeMode>('system')

// Module-level MQL so we can resolve 'system' → 'dark'|'light' without component context.
// data-theme is always kept explicitly set on the root — CSS never needs a media-query fallback.
const system_mql = window.matchMedia('(prefers-color-scheme: dark)')

function applyToDOM(next: ThemeMode) {
  const resolved = next === 'system' ? (system_mql.matches ? 'dark' : 'light') : next
  document.documentElement.setAttribute('data-theme', resolved)
}

// When the OS preference flips while the app is in system mode, keep the attribute in sync.
system_mql.addEventListener('change', () => {
  if (mode.value === 'system') applyToDOM('system')
})

export function useTheme() {
  const storage = useStorage()
  const is_system_dark = useMediaQuery('dark')

  const is_dark = computed(() => {
    if (mode.value === 'system') return is_system_dark.value
    return mode.value === 'dark'
  })

  function load() {
    const saved = storage.get<ThemeMode>(STORAGE_KEY)
    mode.value = saved ?? 'system'
    applyToDOM(mode.value)
  }

  function setMode(next: ThemeMode) {
    mode.value = next
    applyToDOM(next)
    storage.set(STORAGE_KEY, next)
  }

  function cycle() {
    let order: ThemeMode[] = ['light', 'system', 'dark']
    if (is_system_dark.value) order = ['light', 'dark', 'system']
    setMode(order[(order.indexOf(mode.value) + 1) % order.length])
  }

  return { mode, is_dark, setMode, cycle, load }
}

import { ref } from 'vue'
import { useStorage } from '@/composables/use-storage'
import { useMediaQuery } from '@/composables/use-media-query'

export type ThemeMode = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'app-theme'
const mode = ref<ThemeMode>('system')

export function useTheme() {
  const storage = useStorage()
  const is_dark_mode = useMediaQuery('dark')

  function load() {
    const saved = storage.get<ThemeMode>(STORAGE_KEY)
    mode.value = saved ?? 'system'
    apply(mode.value)
  }

  function setMode(next: ThemeMode) {
    mode.value = next
    apply(next)
    storage.set(STORAGE_KEY, next)
  }

  function cycle() {
    let order: ThemeMode[] = ['light', 'system', 'dark']

    if (is_dark_mode.value) {
      order = ['light', 'dark', 'system']
    }

    setMode(order[(order.indexOf(mode.value) + 1) % order.length])
  }

  function apply(mode: ThemeMode) {
    const root = document.documentElement

    if (mode === 'system') {
      root.removeAttribute('data-theme') // let prefers-color-scheme win
    } else {
      root.setAttribute('data-theme', mode) // 'light' | 'dark'
    }
  }

  return {
    mode,
    setMode,
    cycle,
    load
  }
}

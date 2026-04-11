import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { ref } from 'vue'

vi.mock('@/composables/use-media-query')

import { useTheme } from '@/composables/use-theme'
import { useMediaQuery } from '@/composables/use-media-query'

describe('useTheme', () => {
  beforeEach(() => {
    // Set up mock before any useTheme() call captures the ref
    vi.mocked(useMediaQuery).mockReturnValue(ref(false))
    // Reset module-level mode to 'system' (also writes to localStorage)
    useTheme().setMode('system')
    // Clear localStorage so load() tests start clean
    localStorage.clear()
    // Reset DOM attribute
    document.documentElement.removeAttribute('data-theme')
  })

  test('mode defaults to system', () => {
    const { mode } = useTheme()
    expect(mode.value).toBe('system')
  })

  test('setMode updates mode', () => {
    const { setMode, mode } = useTheme()
    setMode('dark')
    expect(mode.value).toBe('dark')
  })

  test('setMode light sets data-theme attribute on documentElement', () => {
    const { setMode } = useTheme()
    setMode('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('setMode dark sets data-theme attribute on documentElement', () => {
    const { setMode } = useTheme()
    setMode('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  test('setMode system removes data-theme attribute', () => {
    const { setMode } = useTheme()
    setMode('dark')
    setMode('system')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  test('setMode persists the selected theme to localStorage', () => {
    const { setMode } = useTheme()
    setMode('light')
    expect(localStorage.getItem('app-theme')).toBe('light')
  })

  test('load reads saved theme from localStorage', () => {
    localStorage.setItem('app-theme', 'dark')
    const { load, mode } = useTheme()
    load()
    expect(mode.value).toBe('dark')
  })

  test('load defaults to system when localStorage has no saved theme', () => {
    const { load, mode } = useTheme()
    load()
    expect(mode.value).toBe('system')
  })

  test('load applies the loaded theme to the DOM', () => {
    localStorage.setItem('app-theme', 'light')
    const { load } = useTheme()
    load()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('is_dark is true when mode is dark', () => {
    const { setMode, is_dark } = useTheme()
    setMode('dark')
    expect(is_dark.value).toBe(true)
  })

  test('is_dark is false when mode is light', () => {
    const { setMode, is_dark } = useTheme()
    setMode('light')
    expect(is_dark.value).toBe(false)
  })

  test('is_dark reflects system preference when mode is system and system is dark', () => {
    vi.mocked(useMediaQuery).mockReturnValue(ref(true))
    const { is_dark } = useTheme()
    expect(is_dark.value).toBe(true)
  })

  test('is_dark is false in system mode when system preference is not dark', () => {
    const { is_dark } = useTheme()
    expect(is_dark.value).toBe(false)
  })

  test('cycle advances from system to dark (light system preference)', () => {
    // order = ['light', 'system', 'dark'], current = 'system' at index 1, next = index 2 = 'dark'
    const { cycle, mode } = useTheme()
    cycle()
    expect(mode.value).toBe('dark')
  })

  test('cycle completes a full rotation for light system preference', () => {
    const { cycle, mode } = useTheme()
    cycle() // system -> dark
    cycle() // dark -> light
    cycle() // light -> system
    expect(mode.value).toBe('system')
  })

  test('cycle advances from system to light when system preference is dark', () => {
    // order = ['light', 'dark', 'system'], current = 'system' at index 2, next = index 0 = 'light'
    vi.mocked(useMediaQuery).mockReturnValue(ref(true))
    const { cycle, mode } = useTheme()
    cycle()
    expect(mode.value).toBe('light')
  })
})

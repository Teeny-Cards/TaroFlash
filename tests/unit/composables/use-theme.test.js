import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { ref } from 'vue'

vi.mock('@/composables/use-media-query')

import { useTheme } from '@/composables/use-theme'
import { useMediaQuery } from '@/composables/use-media-query'

describe('useTheme', () => {
  beforeEach(() => {
    // Reset the OS-preference mock (system_mql) to non-dark before each test.
    // Do NOT clear listeners — the module-level addEventListener call runs once
    // at import time, so the handler would be lost if we reset the array here.
    global.__matchMedia.matches = false

    // Set up useMediaQuery mock before any useTheme() call captures the ref.
    vi.mocked(useMediaQuery).mockReturnValue(ref(false))
    // Reset module-level mode to 'system' (also writes to localStorage).
    useTheme().setMode('system')
    // Clear localStorage so load() tests start clean.
    localStorage.clear()
    // Reset DOM attribute.
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

  test('setMode light sets data-theme to light', () => {
    const { setMode } = useTheme()
    setMode('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('setMode dark sets data-theme to dark', () => {
    const { setMode } = useTheme()
    setMode('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  // The old behaviour removed data-theme for 'system'. The new behaviour always
  // keeps data-theme set explicitly — resolved from the OS preference via MQL.
  test('setMode system sets data-theme to light when system is not dark', () => {
    global.__matchMedia.matches = false
    const { setMode } = useTheme()
    setMode('system')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('setMode system sets data-theme to dark when system is dark', () => {
    global.__matchMedia.matches = true
    const { setMode } = useTheme()
    setMode('system')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
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

  test('load applies an explicit theme to the DOM', () => {
    localStorage.setItem('app-theme', 'light')
    const { load } = useTheme()
    load()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('load with system mode resolves to light when system is not dark', () => {
    global.__matchMedia.matches = false
    localStorage.setItem('app-theme', 'system')
    const { load } = useTheme()
    load()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  test('load with system mode resolves to dark when system is dark', () => {
    global.__matchMedia.matches = true
    localStorage.setItem('app-theme', 'system')
    const { load } = useTheme()
    load()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  // ── MQL change event ───────────────────────────────────────────────────────

  test('OS preference change updates data-theme while in system mode', () => {
    const { setMode } = useTheme()
    setMode('system') // mode = 'system', data-theme = 'light' (matches=false)

    // Simulate the OS flipping to dark.
    global.__matchMedia.matches = true
    global.__matchMedia.listeners.forEach((l) => l())

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  test('OS preference change has no effect when not in system mode', () => {
    const { setMode } = useTheme()
    setMode('light') // explicitly light, ignores OS

    // Simulate OS flip — should NOT change data-theme.
    global.__matchMedia.matches = true
    global.__matchMedia.listeners.forEach((l) => l())

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  // ── is_dark ────────────────────────────────────────────────────────────────

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

  // ── cycle ──────────────────────────────────────────────────────────────────

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

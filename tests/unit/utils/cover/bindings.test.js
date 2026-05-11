import { describe, test, expect } from 'vite-plus/test'
import { coverBindings, patternSize, BORDER_SIZE_PX, PATTERN_SIZE_PX } from '@/utils/cover'

describe('patternSize', () => {
  test('defaults the multiplier to 1', () => {
    // wave scale 2 → PATTERN_SIZE_PX * 2 * 1
    expect(patternSize('wave')).toBe(`${PATTERN_SIZE_PX * 2}px`)
  })

  test('applies the multiplier argument', () => {
    // wave: PATTERN_SIZE_PX * 2 * 0.5
    expect(patternSize('wave', 0.5)).toBe(`${PATTERN_SIZE_PX * 2 * 0.5}px`)
    // aztec: PATTERN_SIZE_PX * 1 * 0.65
    expect(patternSize('aztec', 0.65)).toBe(`${PATTERN_SIZE_PX * 1 * 0.65}px`)
  })
})

describe('coverBindings', () => {
  test('returns empty bindings when called with no argument', () => {
    expect(coverBindings()).toEqual({
      'data-theme': undefined,
      'data-theme-dark': undefined,
      class: [],
      style: {}
    })
  })

  test('falls back to fallbackTheme when config has no theme', () => {
    const result = coverBindings({}, { fallbackTheme: 'blue-500' })
    expect(result['data-theme']).toBe('blue-500')
  })

  test('uses config theme over fallbackTheme', () => {
    const result = coverBindings({ theme: 'pink-400' }, { fallbackTheme: 'blue-500' })
    expect(result['data-theme']).toBe('pink-400')
  })

  test('forwards theme_dark to data-theme-dark when set', () => {
    const result = coverBindings({ theme: 'pink-400', theme_dark: 'pink-700' })
    expect(result['data-theme-dark']).toBe('pink-700')
  })

  test('omits data-theme-dark (undefined) when theme_dark is unset', () => {
    const result = coverBindings({ theme: 'pink-400' })
    expect(result['data-theme-dark']).toBeUndefined()
  })

  test('does not fall back fallbackTheme into data-theme-dark', () => {
    const result = coverBindings({}, { fallbackTheme: 'blue-500' })
    expect(result['data-theme-dark']).toBeUndefined()
  })

  test('emits pattern class when pattern is set', () => {
    const result = coverBindings({ pattern: 'wave' })
    expect(result.class).toContain('bgx-wave')
  })

  test('sets --bgx-fill and pattern-scaled --bgx-opacity when pattern is set', () => {
    const result = coverBindings({ pattern: 'aztec' })
    expect(result.style['--bgx-fill']).toBe('var(--theme-neutral)')
    expect(result.style['--bgx-opacity']).toBe('0.2')
  })

  test('sets --bgx-size from the static patternSize helper when pattern is set', () => {
    const result = coverBindings({ pattern: 'saw' })
    expect(result.style['--bgx-size']).toBe(patternSize('saw'))
  })

  test('omits pattern bindings when no pattern is set', () => {
    const result = coverBindings({})
    expect(result.class).toEqual([])
    expect(result.style['--bgx-size']).toBeUndefined()
    expect(result.style['--bgx-fill']).toBeUndefined()
    expect(result.style['--bgx-opacity']).toBeUndefined()
  })

  test('omits pattern bindings when pattern option is disabled', () => {
    const result = coverBindings({ pattern: 'wave' }, { pattern: false })
    expect(result.class).toEqual([])
    expect(result.style['--bgx-fill']).toBeUndefined()
    expect(result.style['--bgx-opacity']).toBeUndefined()
    expect(result.style['--bgx-size']).toBeUndefined()
  })

  test('options.patternOpacity overrides the per-pattern scaled default', () => {
    const result = coverBindings({ pattern: 'aztec' }, { patternOpacity: '0.5' })
    expect(result.style['--bgx-opacity']).toBe('0.5')
  })

  test('falls back to scaled default when options.patternOpacity is absent', () => {
    // wave scale 3.5 → 0.2 * 3.5 = 0.7
    const result = coverBindings({ pattern: 'wave' })
    expect(parseFloat(result.style['--bgx-opacity'])).toBeCloseTo(0.7)
  })

  test('emits themed border style at the static BORDER_SIZE_PX when config is provided', () => {
    const result = coverBindings({ theme: 'green-400' })
    expect(result.style.border).toBe(`${BORDER_SIZE_PX}px solid var(--theme-primary)`)
  })

  test('omits border style when config is omitted', () => {
    expect(coverBindings().style.border).toBeUndefined()
  })

  test('omits border style when border option is disabled', () => {
    const result = coverBindings({ theme: 'green-400' }, { border: false })
    expect(result.style.border).toBeUndefined()
  })

  test('combines all bindings for a fully configured cover', () => {
    const result = coverBindings({
      theme: 'purple-500',
      theme_dark: 'purple-700',
      pattern: 'aztec'
    })

    expect(result['data-theme']).toBe('purple-500')
    expect(result['data-theme-dark']).toBe('purple-700')
    expect(result.class).toEqual(['bgx-aztec'])
    expect(result.style['--bgx-size']).toBe(patternSize('aztec'))
    expect(result.style['--bgx-opacity']).toBe('0.2')
    expect(result.style['--bgx-fill']).toBe('var(--theme-neutral)')
    expect(result.style.border).toBe(`${BORDER_SIZE_PX}px solid var(--theme-primary)`)
  })
})

import { describe, test, expect } from 'vite-plus/test'
import { coverBindings } from '@/utils/cover'

describe('coverBindings', () => {
  test('returns empty bindings when called with no argument', () => {
    expect(coverBindings()).toEqual({
      'data-theme': undefined,
      class: [],
      style: {}
    })
  })

  test('falls back to fallbackTheme when config has no bg_color', () => {
    const result = coverBindings({}, { fallbackTheme: 'blue-500' })
    expect(result['data-theme']).toBe('blue-500')
  })

  test('uses config bg_color over fallbackTheme', () => {
    const result = coverBindings({ bg_color: 'pink-400' }, { fallbackTheme: 'blue-500' })
    expect(result['data-theme']).toBe('pink-400')
  })

  test('emits pattern class when pattern is set', () => {
    const result = coverBindings({ pattern: 'wave' })
    expect(result.class).toContain('bgx-wave')
  })

  test('always sets fixed --bgx-fill and --bgx-opacity when pattern is set', () => {
    const result = coverBindings({ pattern: 'wave' })
    expect(result.style['--bgx-fill']).toBe('var(--theme-neutral)')
    expect(result.style['--bgx-opacity']).toBe('0.2')
  })

  test('sets --bgx-size style from pattern_size (scaled per pattern)', () => {
    const result = coverBindings({ pattern: 'saw', pattern_size: 20 })
    expect(result.style['--bgx-size']).toBe('20px')
  })

  test('omits pattern bindings when no pattern is set', () => {
    const result = coverBindings({ pattern_size: 20 })
    expect(result.class).toEqual([])
    expect(result.style['--bgx-size']).toBeUndefined()
    expect(result.style['--bgx-fill']).toBeUndefined()
    expect(result.style['--bgx-opacity']).toBeUndefined()
  })

  test('omits pattern bindings when pattern option is disabled', () => {
    const result = coverBindings({ pattern: 'wave', pattern_size: 20 }, { pattern: false })
    expect(result.class).toEqual([])
    expect(result.style['--bgx-fill']).toBeUndefined()
    expect(result.style['--bgx-opacity']).toBeUndefined()
    expect(result.style['--bgx-size']).toBeUndefined()
  })

  test('emits themed border style when border_size is set', () => {
    const result = coverBindings({ border_size: 3 })
    expect(result.style.border).toBe('3px solid var(--theme-primary)')
  })

  test('omits border style when border_size is not set', () => {
    const result = coverBindings({ bg_color: 'green-400' })
    expect(result.style.border).toBeUndefined()
  })

  test('omits border style when border option is disabled', () => {
    const result = coverBindings({ border_size: 3 }, { border: false })
    expect(result.style.border).toBeUndefined()
  })

  test('emits background-image style when bg_image is set', () => {
    const result = coverBindings({ bg_image: 'https://example.com/x.png' })
    expect(result.style.backgroundImage).toBe("url('https://example.com/x.png')")
    expect(result.style.backgroundSize).toBe('cover')
    expect(result.style.backgroundPosition).toBe('center')
  })

  test('omits background-image style when bgImage option is disabled', () => {
    const result = coverBindings({ bg_image: 'https://example.com/x.png' }, { bgImage: false })
    expect(result.style.backgroundImage).toBeUndefined()
  })

  test('combines all bindings for a fully configured cover', () => {
    const result = coverBindings({
      bg_color: 'purple-500',
      pattern: 'aztec',
      pattern_size: 15,
      border_size: 2
    })

    expect(result['data-theme']).toBe('purple-500')
    expect(result.class).toEqual(['bgx-aztec'])
    // aztec has scale 1 in PATTERN_SIZE_SCALE
    expect(result.style['--bgx-size']).toBe('15px')
    expect(result.style['--bgx-opacity']).toBe('0.2')
    expect(result.style['--bgx-fill']).toBe('var(--theme-neutral)')
    expect(result.style.border).toBe('2px solid var(--theme-primary)')
  })
})

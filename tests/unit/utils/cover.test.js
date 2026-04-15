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

  test('emits pattern_size class as arbitrary px length', () => {
    const result = coverBindings({ pattern: 'wave', pattern_size: 20 })
    expect(result.class).toContain('bgx-size-[20px]')
  })

  test('translates 0-1 pattern_opacity to 0-100 scale', () => {
    const result = coverBindings({ pattern: 'wave', pattern_opacity: 0.4 })
    expect(result.class).toContain('bgx-opacity-40')
  })

  test('emits pattern_color as arbitrary --color-* var', () => {
    const result = coverBindings({ pattern: 'wave', pattern_color: 'brown-500' })
    expect(result.class).toContain('bgx-color-[var(--color-brown-500)]')
  })

  test('omits pattern classes when no pattern is set', () => {
    const result = coverBindings({ pattern_size: 20, pattern_color: 'brown-500' })
    expect(result.class).toEqual([])
  })

  test('omits pattern classes when pattern option is disabled', () => {
    const result = coverBindings(
      { pattern: 'wave', pattern_color: 'brown-500' },
      { pattern: false }
    )
    expect(result.class).toEqual([])
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
      pattern_opacity: 0.2,
      pattern_color: 'brown-100',
      border_size: 2
    })

    expect(result['data-theme']).toBe('purple-500')
    expect(result.class).toEqual([
      'bgx-aztec',
      'bgx-size-[15px]',
      'bgx-opacity-20',
      'bgx-color-[var(--color-brown-100)]'
    ])
    expect(result.style.border).toBe('2px solid var(--theme-primary)')
  })
})

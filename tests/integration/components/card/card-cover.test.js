import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import CardCover from '@/components/card/card-cover.vue'

function mountCover(cover = undefined) {
  return shallowMount(CardCover, { props: { cover } })
}

describe('CardCover', () => {
  // ── Default rendering ─────────────────────────────────────────────────────────

  test('renders the cover element', () => {
    const wrapper = mountCover()
    expect(wrapper.find('[data-testid="card-cover"]').exists()).toBe(true)
  })

  test('uses purple-500 as default background when no cover config', () => {
    const wrapper = mountCover()
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-purple-500)'
    )
  })

  test('uses purple-500 as default background when cover has no bg_color', () => {
    const wrapper = mountCover({ pattern: 'stars' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-purple-500)'
    )
  })

  // ── Background color ──────────────────────────────────────────────────────────

  test('applies bg_color as backgroundColor', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-blue-500)'
    )
  })

  test('applies different bg_color themes', () => {
    const wrapper = mountCover({ bg_color: 'green-400' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-green-400)'
    )
  })

  // ── Border ────────────────────────────────────────────────────────────────────

  test('applies no border style when border_color is not set', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).not.toContain('border:')
  })

  test('applies border style when border_color is set', () => {
    const wrapper = mountCover({ border_color: 'red-500' })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('var(--face-border-width)')
    expect(style).toContain('var(--color-red-500)')
  })

  // ── Pattern classes ───────────────────────────────────────────────────────────

  test('applies no pattern bgx class when no pattern', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    const classes = wrapper.find('[data-testid="card-cover"]').classes()
    // Only checks that no specific pattern class is present — the bgx-(--theme-neutral)
    // utility is always applied for pattern fill colour and is not a pattern selector.
    const patternClasses = [
      'bgx-diagonal-stripes',
      'bgx-dot-grid',
      'bgx-wave',
      'bgx-saw',
      'bgx-bank-note',
      'bgx-aztec',
      'bgx-endless-clouds',
      'bgx-stars',
      'bgx-leaf'
    ]
    expect(classes.some((c) => patternClasses.includes(c))).toBe(false)
  })

  test.each([
    ['diagonal-stripes', 'bgx-diagonal-stripes'],
    ['dot-grid', 'bgx-dot-grid'],
    ['wave', 'bgx-wave'],
    ['saw', 'bgx-saw'],
    ['bank-note', 'bgx-bank-note'],
    ['aztec', 'bgx-aztec'],
    ['endless-clouds', 'bgx-endless-clouds'],
    ['stars', 'bgx-stars'],
    ['leaf', 'bgx-leaf']
  ])('pattern "%s" applies class "%s"', (pattern, expectedClass) => {
    const wrapper = mountCover({ pattern })
    expect(wrapper.find('[data-testid="card-cover"]').classes()).toContain(expectedClass)
  })

  // ── Pattern opacity (--bgx-opacity) ──────────────────────────────────────────

  test('sets --bgx-opacity to 0.4 by default when pattern is set', () => {
    const wrapper = mountCover({ pattern: 'wave' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      '--bgx-opacity: 0.4'
    )
  })

  test('sets --bgx-opacity to custom pattern_opacity when provided', () => {
    const wrapper = mountCover({ pattern: 'stars', pattern_opacity: 0.2 })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      '--bgx-opacity: 0.2'
    )
  })

  test('does not set --bgx-opacity when no pattern', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).not.toContain(
      '--bgx-opacity'
    )
  })

  // ── Pattern size (--bgx-size) ─────────────────────────────────────────────────

  test('sets --bgx-size when pattern_size is provided', () => {
    const wrapper = mountCover({ pattern: 'dot-grid', pattern_size: 20 })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      '--bgx-size: 20px'
    )
  })

  test('does not set --bgx-size when pattern_size is not provided', () => {
    const wrapper = mountCover({ pattern: 'dot-grid' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).not.toContain(
      '--bgx-size'
    )
  })

  // ── Background image ──────────────────────────────────────────────────────────

  test('applies bg_image as background-image style', () => {
    const wrapper = mountCover({ bg_image: 'https://example.com/img.png' })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('background-image')
    expect(style).toContain('https://example.com/img.png')
  })

  test('does not set background-image when bg_image is absent', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).not.toContain(
      'background-image'
    )
  })

  // ── Border size ───────────────────────────────────────────────────────────────

  test('uses CSS var border width when border_size is not set', () => {
    const wrapper = mountCover({ border_color: 'red-500' })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('var(--face-border-width)')
    expect(style).toContain('var(--color-red-500)')
  })

  test('uses px border width when border_size is set', () => {
    const wrapper = mountCover({ border_color: 'red-500', border_size: 10 })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('10px')
    expect(style).toContain('var(--color-red-500)')
    expect(style).not.toContain('var(--face-border-width)')
  })

  // ── data-theme ────────────────────────────────────────────────────────────────

  test('sets data-theme to bg_color', () => {
    const wrapper = mountCover({ bg_color: 'green-400' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('data-theme')).toBe('green-400')
  })

  test('data-theme is undefined when no bg_color', () => {
    const wrapper = mountCover()
    expect(wrapper.find('[data-testid="card-cover"]').attributes('data-theme')).toBeUndefined()
  })
})

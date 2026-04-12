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

  test('applies no bgx class when no pattern', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    const classes = wrapper.find('[data-testid="card-cover"]').classes()
    expect(classes.some((c) => c.startsWith('bgx-'))).toBe(false)
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

  // ── Pattern color (--bgx-fill) ────────────────────────────────────────────────

  test('sets --bgx-fill to pattern_color when pattern and pattern_color are set', () => {
    const wrapper = mountCover({ pattern: 'stars', pattern_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-blue-500)'
    )
  })

  test('defaults --bgx-fill to grey-900 when pattern is set but pattern_color is not', () => {
    const wrapper = mountCover({ pattern: 'wave' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).toContain(
      'var(--color-grey-900)'
    )
  })

  test('does not set --bgx-fill when no pattern', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style')).not.toContain(
      '--bgx-fill'
    )
  })
})

import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import CardCover from '@/components/card/card-cover.vue'

function mountCover(cover = undefined) {
  return shallowMount(CardCover, { props: { cover } })
}

describe('CardCover', () => {
  test('renders the cover element', () => {
    const wrapper = mountCover()
    expect(wrapper.find('[data-testid="card-cover"]').exists()).toBe(true)
  })

  test('falls back to purple-500 data-theme when no cover config', () => {
    const wrapper = mountCover()
    expect(wrapper.find('[data-testid="card-cover"]').attributes('data-theme')).toBe('purple-500')
  })

  test('sets data-theme from bg_color', () => {
    const wrapper = mountCover({ bg_color: 'green-400' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('data-theme')).toBe('green-400')
  })

  test('applies no border style when border_size is not set', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style') ?? '').not.toContain(
      'border:'
    )
  })

  test('applies themed border style when border_size is set', () => {
    const wrapper = mountCover({ border_size: 10 })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('10px')
    expect(style).toContain('var(--theme-primary)')
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

  test('applies no pattern class when pattern is unset', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    const classes = wrapper.find('[data-testid="card-cover"]').classes()
    expect(classes.some((c) => c.startsWith('bgx-'))).toBe(false)
  })

  test('applies bg_image as background-image style', () => {
    const wrapper = mountCover({ bg_image: 'https://example.com/img.png' })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain('background-image')
    expect(style).toContain('https://example.com/img.png')
  })

  test('does not set background-image when bg_image is absent', () => {
    const wrapper = mountCover({ bg_color: 'blue-500' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('style') ?? '').not.toContain(
      'background-image'
    )
  })
})

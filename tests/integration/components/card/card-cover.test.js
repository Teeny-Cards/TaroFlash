import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import CardCover from '@/components/card/card-cover.vue'
import { BORDER_SIZE_PX } from '@/utils/cover'

function mountCover(cover) {
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

  test('sets data-theme from theme', () => {
    const wrapper = mountCover({ theme: 'green-400' })
    expect(wrapper.find('[data-testid="card-cover"]').attributes('data-theme')).toBe('green-400')
  })

  test('applies the static themed border style when a config is provided', () => {
    const wrapper = mountCover({ theme: 'blue-500' })
    const style = wrapper.find('[data-testid="card-cover"]').attributes('style')
    expect(style).toContain(`${BORDER_SIZE_PX}px`)
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
    const wrapper = mountCover({ theme: 'blue-500' })
    const classes = wrapper.find('[data-testid="card-cover"]').classes()
    expect(classes.some((c) => c.startsWith('bgx-'))).toBe(false)
  })
})

import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'

const { mockEmitHoverSfx } = vi.hoisted(() => ({ mockEmitHoverSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({
  emitSfx: vi.fn(),
  emitHoverSfx: mockEmitHoverSfx
}))

import UiTagButton from '@/components/ui-kit/tag-button.vue'

function mountTag(props = {}, slot = 'Back') {
  return mount(UiTagButton, {
    props,
    slots: { default: () => slot }
  })
}

describe('UiTagButton', () => {
  beforeEach(() => mockEmitHoverSfx.mockClear())

  test('renders the button with slot content', () => {
    const wrapper = mountTag({}, 'Back')
    const btn = wrapper.find('[data-testid="ui-kit-tag-button"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('Back')
  })

  test('applies a CSS mask inline style to clip the tag silhouette', () => {
    const wrapper = mountTag()
    const btn = wrapper.find('[data-testid="ui-kit-tag-button"]')
    const mask = btn.attributes('style') ?? ''
    expect(mask).toContain('mask')
    expect(mask).toContain('linear-gradient')
  })

  test('emits a click event when the button is clicked', async () => {
    const wrapper = mountTag()
    await wrapper.find('[data-testid="ui-kit-tag-button"]').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  test('renders the hover-fx overlay by default (fancyHover enabled)', () => {
    const wrapper = mountTag()
    expect(wrapper.find('[data-testid="ui-kit-tag-button__hover-fx"]').exists()).toBe(true)
  })

  test('omits the hover-fx overlay when fancyHover is false', () => {
    const wrapper = mountTag({ fancyHover: false })
    expect(wrapper.find('[data-testid="ui-kit-tag-button__hover-fx"]').exists()).toBe(false)
  })

  test('asymmetric padding follows the notch side (notch on right → extra padding-left for outset)', () => {
    const right = mountTag({ notchSide: 'right' })
    const left = mountTag({ notchSide: 'left' })
    const rightStyle = right.find('[data-testid="ui-kit-tag-button"]').attributes('style') ?? ''
    const leftStyle = left.find('[data-testid="ui-kit-tag-button"]').attributes('style') ?? ''
    // Both sides include padding; the values mirror across notchSide.
    expect(rightStyle).toMatch(/padding-left:\s*\d+px/)
    expect(rightStyle).toMatch(/padding-right:\s*\d+px/)
    expect(leftStyle).toMatch(/padding-left:\s*\d+px/)
    expect(leftStyle).toMatch(/padding-right:\s*\d+px/)
  })
})

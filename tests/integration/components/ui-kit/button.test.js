import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiButton from '@/components/ui-kit/button.vue'

function mountButton(props = {}, slots = {}) {
  return shallowMount(UiButton, { props, slots })
}

describe('UiButton', () => {
  // ── mobileTooltip ──────────────────────────────────────────────────────────

  describe('mobileTooltip prop', () => {
    test('renders tooltip when iconOnly=true, slot content exists, and mobileTooltip=true', () => {
      const wrapper = mountButton({ iconOnly: true, mobileTooltip: true }, { default: 'Close' })
      expect(wrapper.find('[data-testid="ui-kit-btn__tooltip"]').exists()).toBe(true)
    })

    // mobileTooltip=false adds a CSS utility class to hide the tooltip on mobile
    // but the element still exists in the DOM. data-mobile-tooltip encodes the state.
    test('tooltip is mobile-hidden when mobileTooltip=false even with iconOnly and slot content', () => {
      const wrapper = mountButton({ iconOnly: true, mobileTooltip: false }, { default: 'Close' })
      const tooltip = wrapper.find('[data-testid="ui-kit-btn__tooltip"]')
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.attributes('data-mobile-tooltip')).toBe('false')
    })

    test('tooltip defaults to visible (mobileTooltip defaults to true)', () => {
      const wrapper = mountButton({ iconOnly: true }, { default: 'Close' })
      expect(wrapper.find('[data-testid="ui-kit-btn__tooltip"]').exists()).toBe(true)
    })

    test('tooltip is absent when there is no slot content, regardless of mobileTooltip', () => {
      const wrapper = mountButton({ iconOnly: true, mobileTooltip: true })
      expect(wrapper.find('[data-testid="ui-kit-btn__tooltip"]').exists()).toBe(false)
    })

    test('tooltip is absent when iconOnly=false', () => {
      const wrapper = mountButton({ iconOnly: false, mobileTooltip: true }, { default: 'Label' })
      expect(wrapper.find('[data-testid="ui-kit-btn__tooltip"]').exists()).toBe(false)
    })
  })

  // ── data-testid ────────────────────────────────────────────────────────────

  test('renders the button element', () => {
    const wrapper = mountButton()
    expect(wrapper.find('[data-testid="ui-kit-button"]').exists()).toBe(true)
  })

  // ── data-theme forwarding ──────────────────────────────────────────────────

  test('forwards data-theme attribute to the root element', () => {
    const wrapper = shallowMount(UiButton, { attrs: { 'data-theme': 'green-400' } })
    expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme')).toBe('green-400')
  })

  test('forwards data-theme-dark attribute to the root element', () => {
    const wrapper = shallowMount(UiButton, {
      attrs: { 'data-theme': 'green-400', 'data-theme-dark': 'grey-900' }
    })
    expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme-dark')).toBe(
      'grey-900'
    )
  })
})

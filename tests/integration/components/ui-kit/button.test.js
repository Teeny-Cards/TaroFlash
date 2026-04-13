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
      const wrapper = mountButton(
        { iconOnly: true, mobileTooltip: true },
        { default: 'Close' }
      )
      expect(wrapper.find('[data-testid="ui-kit-btn__tooltip"]').exists()).toBe(true)
    })

    // mobileTooltip=false adds a CSS utility class to hide the tooltip on mobile
    // but the element still exists in the DOM. data-mobile-tooltip encodes the state.
    test('tooltip is mobile-hidden when mobileTooltip=false even with iconOnly and slot content', () => {
      const wrapper = mountButton(
        { iconOnly: true, mobileTooltip: false },
        { default: 'Close' }
      )
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

  // ── data-theme ─────────────────────────────────────────────────────────────

  test('sets data-theme to the theme prop', () => {
    const wrapper = mountButton({ theme: 'green-400' })
    expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme')).toBe('green-400')
  })

  test('defaults data-theme to blue-500', () => {
    const wrapper = mountButton()
    expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme')).toBe('blue-500')
  })

  // ── data-theme-dark ──────────────────────────────────────────────────────

  describe('data-theme-dark', () => {
    test('sets data-theme-dark to the themeDark prop', () => {
      const wrapper = mountButton({ theme: 'green-400', themeDark: 'grey-900' })
      expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme-dark')).toBe(
        'grey-900'
      )
    })

    test('falls back to theme when themeDark is not provided', () => {
      const wrapper = mountButton({ theme: 'green-400' })
      expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme-dark')).toBe(
        'green-400'
      )
    })

    test('falls back to default theme (blue-500) when neither prop is set', () => {
      const wrapper = mountButton()
      expect(wrapper.find('[data-testid="ui-kit-button"]').attributes('data-theme-dark')).toBe(
        'blue-500'
      )
    })
  })
})

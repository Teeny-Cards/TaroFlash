import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiButton from '@/components/ui-kit/button.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'

function mountButton(props = {}, slots = {}) {
  return shallowMount(UiButton, { props, slots })
}

function findTooltip(wrapper) {
  return wrapper.findComponent(UiTooltip)
}

describe('UiButton', () => {
  // ── tooltip wiring ─────────────────────────────────────────────────────────

  describe('tooltip', () => {
    test('tooltip enabled when iconOnly=true and slot content exists', () => {
      const wrapper = mountButton({ iconOnly: true }, { default: 'Close' })
      expect(findTooltip(wrapper).props('suppress')).toBe(false)
    })

    test('tooltip suppressed when iconOnly=false', () => {
      const wrapper = mountButton({ iconOnly: false }, { default: 'Label' })
      expect(findTooltip(wrapper).props('suppress')).toBe(true)
    })

    test('tooltip suppressed when there is no slot content', () => {
      const wrapper = mountButton({ iconOnly: true })
      expect(findTooltip(wrapper).props('suppress')).toBe(true)
    })

    test('mobileTooltip=true forwards static_on_mobile=true (tap-shows on mobile)', () => {
      const wrapper = mountButton({ iconOnly: true, mobileTooltip: true }, { default: 'Close' })
      expect(findTooltip(wrapper).props('static_on_mobile')).toBe(true)
    })

    test('mobileTooltip=false forwards static_on_mobile=false (hover-only)', () => {
      const wrapper = mountButton({ iconOnly: true, mobileTooltip: false }, { default: 'Close' })
      expect(findTooltip(wrapper).props('static_on_mobile')).toBe(false)
    })

    test('renders tooltip via element=button (button is the trigger)', () => {
      const wrapper = mountButton({ iconOnly: true }, { default: 'Close' })
      expect(findTooltip(wrapper).props('element')).toBe('button')
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

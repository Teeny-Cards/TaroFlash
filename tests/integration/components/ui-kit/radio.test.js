import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiRadio from '@/components/ui-kit/radio.vue'

function mountRadio(props = {}) {
  return shallowMount(UiRadio, { props })
}

describe('UiRadio', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the radio element', () => {
    const wrapper = mountRadio({ checked: false })
    expect(wrapper.find('[data-testid="ui-kit-radio"]').exists()).toBe(true)
  })

  // ── data-theme ─────────────────────────────────────────────────────────────

  test('sets data-theme to the theme prop', () => {
    const wrapper = mountRadio({ checked: false, theme: 'green-400' })
    expect(wrapper.find('[data-testid="ui-kit-radio"]').attributes('data-theme')).toBe('green-400')
  })

  test('defaults data-theme to blue-500', () => {
    const wrapper = mountRadio({ checked: false })
    expect(wrapper.find('[data-testid="ui-kit-radio"]').attributes('data-theme')).toBe('blue-500')
  })

  // ── checked state ──────────────────────────────────────────────────────────

  test('renders check icon when checked=true', () => {
    const wrapper = mountRadio({ checked: true })
    // UiIcon stub renders as ui-icon
    expect(wrapper.find('ui-icon-stub[src="check"]').exists()).toBe(true)
  })

  test('does not render check icon when checked=false', () => {
    const wrapper = mountRadio({ checked: false })
    expect(wrapper.find('ui-icon-stub[src="check"]').exists()).toBe(false)
  })

  // ── intermediate state ─────────────────────────────────────────────────────

  test('renders minus icon when intermediate=true', () => {
    const wrapper = mountRadio({ checked: false, intermediate: true })
    expect(wrapper.find('ui-icon-stub[src="minus"]').exists()).toBe(true)
  })

  test('does not render minus icon when intermediate is not set', () => {
    const wrapper = mountRadio({ checked: false })
    expect(wrapper.find('ui-icon-stub[src="minus"]').exists()).toBe(false)
  })

  test('can show both check and minus icons simultaneously', () => {
    const wrapper = mountRadio({ checked: true, intermediate: true })
    expect(wrapper.find('ui-icon-stub[src="check"]').exists()).toBe(true)
    expect(wrapper.find('ui-icon-stub[src="minus"]').exists()).toBe(true)
  })
})

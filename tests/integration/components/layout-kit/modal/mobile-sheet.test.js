import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import MobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'

function mountSheet(props = {}, slots = {}) {
  return shallowMount(MobileSheet, { props, slots })
}

describe('MobileSheet', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the sheet root element', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="mobile-sheet"]').exists()).toBe(true)
  })

  test('always renders body slot area', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="mobile-sheet__body"]').exists()).toBe(true)
  })

  test('always renders footer slot area', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="mobile-sheet__footer"]').exists()).toBe(true)
  })

  // ── data-theme ─────────────────────────────────────────────────────────────

  test('sets data-theme to the theme prop', () => {
    const wrapper = mountSheet({ theme: 'blue-500' })
    expect(wrapper.find('[data-testid="mobile-sheet"]').attributes('data-theme')).toBe('blue-500')
  })

  test('defaults data-theme to green-400', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="mobile-sheet"]').attributes('data-theme')).toBe('green-400')
  })

  // ── showHeader logic ───────────────────────────────────────────────────────

  test('shows default header when title prop is provided', () => {
    const wrapper = mountSheet({ title: 'My Title' })
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').exists()).toBe(true)
  })

  test('hides header when no title and no header slots are provided', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').exists()).toBe(false)
  })

  test('shows header when header-content slot is provided', () => {
    const wrapper = mountSheet({}, { 'header-content': '<span>content</span>' })
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').exists()).toBe(true)
  })

  test('shows header when header-left slot is provided', () => {
    const wrapper = mountSheet({}, { 'header-left': '<span>left</span>' })
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').exists()).toBe(true)
  })

  test('custom header slot replaces the default header entirely', () => {
    const wrapper = mountSheet(
      { title: 'My Title' },
      { header: '<div data-testid="custom-header">Custom</div>' }
    )
    expect(wrapper.find('[data-testid="custom-header"]').exists()).toBe(true)
    // Default header is not rendered when a custom header slot is used
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').exists()).toBe(false)
  })

  // ── title rendering ────────────────────────────────────────────────────────

  test('renders the title prop inside the header', () => {
    const wrapper = mountSheet({ title: 'Hello World' })
    expect(wrapper.find('[data-testid="mobile-sheet__header"]').text()).toContain('Hello World')
  })

  // ── close event ───────────────────────────────────────────────────────────

  test('close button emits close event when clicked', async () => {
    const wrapper = mountSheet({ title: 'My Sheet' })
    // shallowMount stubs child components — find the stub by its icon-only attribute
    // and trigger click on the wrapper's native element containing the handler
    const closeBtn = wrapper.find('ui-button-stub')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  // ── body and footer slots ──────────────────────────────────────────────────

  test('renders body slot content', () => {
    const wrapper = mountSheet({}, { body: '<p data-testid="body-content">Body</p>' })
    expect(wrapper.find('[data-testid="body-content"]').exists()).toBe(true)
  })

  test('renders footer slot content', () => {
    const wrapper = mountSheet({}, { footer: '<p data-testid="footer-content">Footer</p>' })
    expect(wrapper.find('[data-testid="footer-content"]').exists()).toBe(true)
  })
})

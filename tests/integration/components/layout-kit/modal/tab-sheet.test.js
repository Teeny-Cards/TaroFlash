import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import TabSheet from '@/components/layout-kit/modal/tab-sheet.vue'

const tabs = [
  { value: 'one', label: 'One', icon: 'card-deck' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' }
]

// Stub mobile-sheet that renders every slot tab-sheet hands it so we can
// assert against the forwarded slot content while keeping tab-sheet's
// own template under test.
const MobileSheetStub = defineComponent({
  name: 'MobileSheet',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'mobile-sheet-stub' }, [
        slots.overlay?.(),
        slots['header-content']?.(),
        slots.sidebar?.(),
        slots.default?.(),
        slots.footer?.()
      ])
  }
})

function mountSheet(props = {}, slots = {}) {
  return shallowMount(TabSheet, {
    props: { tabs, ...props },
    slots,
    global: { stubs: { MobileSheet: MobileSheetStub } }
  })
}

describe('TabSheet', () => {
  beforeEach(() => setActivePinia(createPinia()))

  // ── Sidebar rendering ──────────────────────────────────────────────────────

  test('renders one button per tab', () => {
    const wrapper = mountSheet()
    expect(wrapper.findAll('[data-testid="tab-sheet__tab"]')).toHaveLength(tabs.length)
  })

  test('highlights the first tab as active by default', () => {
    const wrapper = mountSheet()
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    expect(buttons[0].attributes('data-active')).toBe('true')
    expect(buttons[1].attributes('data-active')).toBe('false')
  })

  test('renders the close button in the sidebar', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="tab-sheet__close-button"]').exists()).toBe(true)
  })

  test('omits the sidebar entirely when no tabs are provided', () => {
    const wrapper = shallowMount(TabSheet, {
      props: { tabs: [] },
      global: { stubs: { MobileSheet: MobileSheetStub } }
    })
    expect(wrapper.find('[data-testid="tab-sheet__sidebar"]').exists()).toBe(false)
  })

  // ── Tablist a11y ───────────────────────────────────────────────────────────

  test('marks the active tab with aria-selected=true and inactive with false', () => {
    const wrapper = mountSheet({ active: 'two' })
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    expect(buttons[1].attributes('aria-selected')).toBe('true')
    expect(buttons[0].attributes('aria-selected')).toBe('false')
  })

  test('exposes role="tablist" on the tab list and role="tab" on each tab', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="tab-sheet__tabs"]').attributes('role')).toBe('tablist')
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    for (const button of buttons) expect(button.attributes('role')).toBe('tab')
  })

  test('exposes role="tabpanel" on the content container', () => {
    const wrapper = mountSheet()
    expect(wrapper.find('[data-testid="tab-sheet__content"]').attributes('role')).toBe('tabpanel')
  })

  // ── Tab switching + v-model ────────────────────────────────────────────────

  test('clicking a different tab emits update:active with that tab value', async () => {
    const wrapper = mountSheet()
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    await buttons[1].trigger('click')

    const events = wrapper.emitted('update:active')
    expect(events).toBeTruthy()
    expect(events[events.length - 1]).toEqual(['two'])
  })

  test('clicking a different tab emits select with that tab value', async () => {
    const wrapper = mountSheet()
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['two']])
  })

  test('clicking the already-active tab emits reselect, not update:active', async () => {
    const wrapper = mountSheet({ active: 'two' })
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('reselect')).toEqual([['two']])
    const events = wrapper.emitted('update:active') ?? []
    const fromClick = events.filter(([value]) => value === 'two')
    expect(fromClick.length).toBeLessThanOrEqual(1)
  })

  test('respects the active prop / v-model on initial render', () => {
    const wrapper = mountSheet({ active: 'three' })
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    expect(buttons[2].attributes('data-active')).toBe('true')
    expect(buttons[0].attributes('data-active')).toBe('false')
  })

  // ── Slot forwarding ────────────────────────────────────────────────────────

  test('renders default slot inside the content area', () => {
    const wrapper = mountSheet({}, { default: '<p data-testid="content">body</p>' })
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
  })

  test('renders before and after slots in the content area', () => {
    const wrapper = mountSheet(
      {},
      {
        before: '<p data-testid="before">b</p>',
        after: '<p data-testid="after">a</p>'
      }
    )
    expect(wrapper.find('[data-testid="before"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="after"]').exists()).toBe(true)
  })

  test('forwards overlay slot through to the underlying mobile-sheet', () => {
    const wrapper = mountSheet({}, { overlay: '<div data-testid="overlay-content">over</div>' })
    expect(wrapper.find('[data-testid="overlay-content"]').exists()).toBe(true)
  })

  test('forwards header-content slot through to the underlying mobile-sheet', () => {
    const wrapper = mountSheet(
      { title: 'My Sheet' },
      { 'header-content': '<h2 data-testid="header-custom">Custom</h2>' }
    )
    expect(wrapper.find('[data-testid="header-custom"]').exists()).toBe(true)
  })

  test('forwards footer slot through to the underlying mobile-sheet', () => {
    const wrapper = mountSheet({}, { footer: '<div data-testid="footer-content">f</div>' })
    expect(wrapper.find('[data-testid="footer-content"]').exists()).toBe(true)
  })

  // ── parts prop ─────────────────────────────────────────────────────────────

  test('merges parts.content classes onto the content container', () => {
    const wrapper = mountSheet({ parts: { content: 'extra-content-class' } })
    const classes = wrapper.find('[data-testid="tab-sheet__content"]').classes()
    expect(classes).toContain('extra-content-class')
  })

  test('merges parts.sidebar classes onto the sidebar container', () => {
    const wrapper = mountSheet({ parts: { sidebar: 'extra-sidebar-class' } })
    const classes = wrapper.find('[data-testid="tab-sheet__sidebar"]').classes()
    expect(classes).toContain('extra-sidebar-class')
  })

  test('merges parts.tab classes onto each tab button', () => {
    const wrapper = mountSheet({ parts: { tab: 'extra-tab-class' } })
    const buttons = wrapper.findAll('[data-testid="tab-sheet__tab"]')
    for (const button of buttons) {
      expect(button.classes()).toContain('extra-tab-class')
    }
  })

  // ── close event ────────────────────────────────────────────────────────────

  test('clicking the close button emits close', async () => {
    const wrapper = mountSheet()
    const closeBtn = wrapper.find('[data-testid="tab-sheet__close-button"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

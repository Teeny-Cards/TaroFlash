import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import TabBar from '@/components/modals/deck-settings/tab-bar.vue'

// ── Helpers ────────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'cover', label: 'Cover' },
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' }
]

function makeTabBar(props = {}) {
  return shallowMount(TabBar, {
    props: { tabs: TABS, active: 'cover', ...props }
  })
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('TabBar', () => {
  test('renders the container', () => {
    const wrapper = makeTabBar()
    expect(wrapper.find('[data-testid="tab-bar"]').exists()).toBe(true)
  })

  test('renders one button per tab', () => {
    const wrapper = makeTabBar()
    expect(wrapper.findAll('[data-testid="tab-bar__tab"]')).toHaveLength(3)
  })

  test('renders each tab label', () => {
    const wrapper = makeTabBar()
    const tabs = wrapper.findAll('[data-testid="tab-bar__tab"]')
    expect(tabs[0].text()).toBe('Cover')
    expect(tabs[1].text()).toBe('Front')
    expect(tabs[2].text()).toBe('Back')
  })

  test('marks the active tab via data-active', () => {
    const wrapper = makeTabBar({ active: 'front' })
    const tabs = wrapper.findAll('[data-testid="tab-bar__tab"]')
    expect(tabs[0].attributes('data-active')).toBe('false')
    expect(tabs[1].attributes('data-active')).toBe('true')
    expect(tabs[2].attributes('data-active')).toBe('false')
  })

  test('emits update:active with tab value when clicked', async () => {
    const wrapper = makeTabBar({ active: 'cover' })
    const tabs = wrapper.findAll('[data-testid="tab-bar__tab"]')
    await tabs[2].trigger('click')
    expect(wrapper.emitted('update:active')).toEqual([['back']])
  })

  test('emits update:active even when clicking the already-active tab', async () => {
    const wrapper = makeTabBar({ active: 'cover' })
    const tabs = wrapper.findAll('[data-testid="tab-bar__tab"]')
    await tabs[0].trigger('click')
    expect(wrapper.emitted('update:active')).toEqual([['cover']])
  })

  test('supports numeric tab values', async () => {
    const numericTabs = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' }
    ]
    const wrapper = shallowMount(TabBar, {
      props: { tabs: numericTabs, active: 2 }
    })
    const tabs = wrapper.findAll('[data-testid="tab-bar__tab"]')
    expect(tabs[1].attributes('data-active')).toBe('true')
    await tabs[0].trigger('click')
    expect(wrapper.emitted('update:active')).toEqual([[1]])
  })
})

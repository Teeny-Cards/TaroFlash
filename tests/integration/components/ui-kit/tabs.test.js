import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import Tabs from '@/components/ui-kit/tabs.vue'

vi.mock('@/composables/audio', () => ({
  useAudio: vi.fn(() => ({
    play: vi.fn()
  }))
}))

const globalConfig = {
  global: {
    stubs: {
      'ui-kit:icon': {
        template: '<div class="icon-stub" :data-src="src"></div>',
        props: ['src']
      }
    }
  }
}

describe('Basic Rendering', () => {
  it('renders properly with tabs prop', () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: { tabs }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="ui-kit-tabs__tabs"]').exists()).toBe(true)

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')
    expect(tabElements).toHaveLength(3)
  })

  it('renders tab labels correctly', () => {
    const tabs = [{ label: 'First Tab' }, { label: 'Second Tab' }, { label: 'Third Tab' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: { tabs }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    expect(tabElements[0].find('.ui-kit-tabs__tab-label').text()).toBe('First Tab')
    expect(tabElements[1].find('.ui-kit-tabs__tab-label').text()).toBe('Second Tab')
    expect(tabElements[2].find('.ui-kit-tabs__tab-label').text()).toBe('Third Tab')
  })

  it('renders icons when provided', () => {
    const tabs = [
      { label: 'Tab 1', icon: 'home' },
      { label: 'Tab 2', icon: 'settings' },
      { label: 'Tab 3' } // No icon
    ]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: { tabs }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // First two tabs should have icons
    expect(tabElements[0].find('.icon-stub').exists()).toBe(true)
    expect(tabElements[0].find('.icon-stub').attributes('data-src')).toBe('home')

    expect(tabElements[1].find('.icon-stub').exists()).toBe(true)
    expect(tabElements[1].find('.icon-stub').attributes('data-src')).toBe('settings')

    // Third tab should not have an icon
    expect(tabElements[2].find('.icon-stub').exists()).toBe(false)
  })

  it('renders tooltips for inactive tabs', () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0, // First tab is active
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Active tab (index 0) should not have tooltip
    expect(tabElements[0].find('.ui-kit-tabs__tab-tooltip').exists()).toBe(false)

    // Inactive tabs should have tooltips
    expect(tabElements[1].find('.ui-kit-tabs__tab-tooltip').exists()).toBe(true)
    expect(tabElements[1].find('.ui-kit-tabs__tab-tooltip').text()).toBe('Tab 2')

    expect(tabElements[2].find('.ui-kit-tabs__tab-tooltip').exists()).toBe(true)
    expect(tabElements[2].find('.ui-kit-tabs__tab-tooltip').text()).toBe('Tab 3')
  })
})

describe('Active Tab State', () => {
  it('applies active class to the correct tab', () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 1, // Second tab is active
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    expect(tabElements[0].classes()).not.toContain('ui-kit-tabs__tab--active')
    expect(tabElements[1].classes()).toContain('ui-kit-tabs__tab--active')
    expect(tabElements[2].classes()).not.toContain('ui-kit-tabs__tab--active')
  })

  it('updates active tab when activeTab prop changes', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': () => {}
      }
    })

    let tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')
    expect(tabElements[0].classes()).toContain('ui-kit-tabs__tab--active')
    expect(tabElements[1].classes()).not.toContain('ui-kit-tabs__tab--active')

    // Change active tab
    await wrapper.setProps({ activeTab: 1 })

    tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')
    expect(tabElements[0].classes()).not.toContain('ui-kit-tabs__tab--active')
    expect(tabElements[1].classes()).toContain('ui-kit-tabs__tab--active')
  })
})

describe('Click Interactions', () => {
  it('emits update:activeTab event when clicking inactive tab', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Click on second tab (inactive)
    await tabElements[1].trigger('click')

    expect(wrapper.emitted('update:activeTab')).toBeTruthy()
    expect(wrapper.emitted('update:activeTab')[0]).toEqual([1])
  })

  it('does not emit update:activeTab when clicking active tab', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Click on first tab (active)
    await tabElements[0].trigger('click')

    expect(wrapper.emitted('update:activeTab')).toBeFalsy()
  })

  it('handles multiple tab clicks correctly', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Click on second tab
    await tabElements[1].trigger('click')
    expect(wrapper.emitted('update:activeTab')).toBeTruthy()
    expect(wrapper.emitted('update:activeTab')[0]).toEqual([1])

    // Click on third tab
    await tabElements[2].trigger('click')
    expect(wrapper.emitted('update:activeTab')).toHaveLength(2)
    expect(wrapper.emitted('update:activeTab')[1]).toEqual([2])
  })
})

describe('Hover Interactions', () => {
  it('handles mouseenter events on tabs', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': () => {}
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Should not throw error when hovering
    await expect(tabElements[0].trigger('mouseenter')).resolves.not.toThrow()
    await expect(tabElements[1].trigger('mouseenter')).resolves.not.toThrow()
  })
})

describe('v-model Integration', () => {
  it('works with v-model:activeTab', async () => {
    const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: {
        tabs,
        activeTab: 0,
        'onUpdate:activeTab': (value) => wrapper.setProps({ activeTab: value })
      }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')

    // Initially first tab should be active
    expect(tabElements[0].classes()).toContain('ui-kit-tabs__tab--active')
    expect(tabElements[1].classes()).not.toContain('ui-kit-tabs__tab--active')

    // Click second tab
    await tabElements[1].trigger('click')

    // Should emit the event and update when parent responds
    expect(wrapper.emitted('update:activeTab')).toBeTruthy()
    expect(wrapper.emitted('update:activeTab')[0]).toEqual([1])
  })
})

describe('Edge Cases', () => {
  it('handles empty tabs array', () => {
    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: { tabs: [] }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')).toHaveLength(0)
  })

  it('handles tabs without labels', () => {
    const tabs = [{ label: '' }, { label: 'Tab 2' }]

    const wrapper = shallowMount(Tabs, {
      ...globalConfig,
      props: { tabs }
    })

    const tabElements = wrapper.findAll('[data-testid="ui-kit-tabs__tab"]')
    expect(tabElements[0].find('.ui-kit-tabs__tab-label').text()).toBe('')
    expect(tabElements[1].find('.ui-kit-tabs__tab-label').text()).toBe('Tab 2')
  })
})

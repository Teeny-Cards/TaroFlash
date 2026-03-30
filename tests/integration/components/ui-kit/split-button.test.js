import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vite-plus/test'
import SplitButton from '@/components/ui-kit/split-button/index.vue'

describe('basic rendering', () => {
  it('renders the component', () => {
    const wrapper = mount(SplitButton)
    expect(wrapper.find('[data-testid="ui-kit-split-button"]').exists()).toBe(true)
  })

  it('renders the toggle button', () => {
    const wrapper = mount(SplitButton)
    expect(wrapper.find('[data-testid="ui-kit-split-button__toggle"]').exists()).toBe(true)
  })

  it('does not show dropdown initially', () => {
    const wrapper = mount(SplitButton)
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })
})

describe('dropdown interaction', () => {
  it('opens dropdown when toggle button is clicked', async () => {
    const wrapper = mount(SplitButton)
    await wrapper.find('[data-testid="ui-kit-split-button__toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)
  })

  it('closes dropdown when toggle button is clicked again', async () => {
    const wrapper = mount(SplitButton)
    const toggle = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggle.trigger('click')
    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })

  it('handles rapid toggle interactions correctly', async () => {
    const wrapper = mount(SplitButton)
    const toggle = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)
  })
})

describe('slot content', () => {
  it('renders defaults slot content', () => {
    const wrapper = mount(SplitButton, {
      slots: {
        defaults: '<button data-testid="test-default">Save</button>'
      }
    })
    expect(wrapper.find('[data-testid="test-default"]').text()).toBe('Save')
  })

  it('renders options slot content in dropdown when open', async () => {
    const wrapper = mount(SplitButton, {
      slots: {
        options: '<button data-testid="test-option">Save As</button>'
      }
    })
    await wrapper.find('[data-testid="ui-kit-split-button__toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="test-option"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="test-option"]').text()).toBe('Save As')
  })

  it('options slot content is hidden when dropdown is closed', () => {
    const wrapper = mount(SplitButton, {
      slots: {
        options: '<button data-testid="test-option">Save As</button>'
      }
    })
    expect(wrapper.find('[data-testid="test-option"]').exists()).toBe(false)
  })
})

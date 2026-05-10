import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { h } from 'vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'

describe('LabeledSection', () => {
  test('renders the label and root testid', () => {
    const wrapper = shallowMount(LabeledSection, { props: { label: 'Cards' } })
    expect(wrapper.find('[data-testid="labeled-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="labeled-section__label"]').text()).toBe('Cards')
  })

  test('renders default slot content', () => {
    const wrapper = shallowMount(LabeledSection, {
      props: { label: 'Cards' },
      slots: { default: () => h('div', { 'data-testid': 'child' }) }
    })
    expect(
      wrapper.find('[data-testid="labeled-section__content"] [data-testid="child"]').exists()
    ).toBe(true)
  })

  test('omits description block when description is unset', () => {
    const wrapper = shallowMount(LabeledSection, { props: { label: 'Cards' } })
    expect(wrapper.find('[data-testid="labeled-section__description"]').exists()).toBe(false)
  })

  test('renders description when provided', () => {
    const wrapper = shallowMount(LabeledSection, {
      props: { label: 'Daily Limits', description: 'Cap how many cards per day.' }
    })
    expect(wrapper.find('[data-testid="labeled-section__description"]').text()).toBe(
      'Cap how many cards per day.'
    )
  })

  test('omits actions slot wrapper when no slot is provided', () => {
    const wrapper = shallowMount(LabeledSection, { props: { label: 'Cards' } })
    expect(wrapper.find('[data-testid="labeled-section__actions"]').exists()).toBe(false)
  })

  test('renders actions slot beside the label when provided', () => {
    const wrapper = shallowMount(LabeledSection, {
      props: { label: 'Cards' },
      slots: { actions: () => h('div', { 'data-testid': 'child' }) }
    })
    const actions = wrapper.find('[data-testid="labeled-section__actions"]')
    expect(actions.exists()).toBe(true)
    expect(actions.find('[data-testid="child"]').exists()).toBe(true)
  })
})

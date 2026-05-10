import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { h } from 'vue'
import SectionList from '@/components/layout-kit/section-list.vue'

describe('SectionList', () => {
  test('renders the root container', () => {
    const wrapper = shallowMount(SectionList)
    expect(wrapper.find('[data-testid="section-list"]').exists()).toBe(true)
  })

  test('renders the default slot content', () => {
    const wrapper = shallowMount(SectionList, {
      slots: {
        default: () => [
          h('div', { 'data-testid': 'child-a' }),
          h('div', { 'data-testid': 'child-b' })
        ]
      }
    })
    expect(wrapper.find('[data-testid="child-a"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="child-b"]').exists()).toBe(true)
  })
})

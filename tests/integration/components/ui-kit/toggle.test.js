import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import Toggle from '@/components/ui-kit/toggle.vue'

// Test unchecked state
it('renders properly in unchecked state', () => {
  const wrapper = shallowMount(Toggle, {
    props: {
      checked: false
    }
  })

  expect(wrapper.exists()).toBe(true)

  // Container should have white background when unchecked
  const container = wrapper.find('div')
  expect(container.classes()).toContain('bg-white')
  expect(container.classes()).not.toContain('bg-green-400')

  // Toggle handle should have grey-500 background and no transform when unchecked
  const handle = container.find('div')
  expect(handle.classes()).toContain('bg-grey')
  expect(handle.classes()).not.toContain('bg-white')
  expect(handle.classes()).not.toContain('transform')
  expect(handle.classes()).not.toContain('translate-x-full')
})

// Test checked state
it('renders properly in checked state', () => {
  const wrapper = shallowMount(Toggle, {
    props: {
      checked: true
    }
  })

  expect(wrapper.exists()).toBe(true)

  // Container should have green-400 background when checked
  const container = wrapper.find('div')
  expect(container.classes()).toContain('bg-green-400')
  expect(container.classes()).not.toContain('bg-white')

  // Toggle handle should have white background and transform when checked
  const handle = container.find('div')
  expect(handle.classes()).toContain('bg-white')
  expect(handle.classes()).not.toContain('bg-grey')
  expect(handle.classes()).toContain('transform')
  expect(handle.classes()).toContain('translate-x-full')
})

// Test prop reactivity
it('updates UI when checked prop changes', async () => {
  const wrapper = shallowMount(Toggle, {
    props: {
      checked: false
    }
  })

  // Initially unchecked
  let container = wrapper.find('div')
  expect(container.classes()).toContain('bg-white')

  // Update to checked
  await wrapper.setProps({ checked: true })

  // Should now be checked
  container = wrapper.find('div')
  expect(container.classes()).toContain('bg-green-400')

  // Update back to unchecked
  await wrapper.setProps({ checked: false })

  // Should now be unchecked again
  container = wrapper.find('div')
  expect(container.classes()).toContain('bg-white')
})

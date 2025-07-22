import { shallowMount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Input from '@/components/ui-kit/input.vue'

test('renders the input element with default props', () => {
  const wrapper = shallowMount(Input)
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.classes()).toContain('ui-kit-input')
  expect(wrapper.classes()).toContain('ui-kit-input--text-left')
  expect(wrapper.classes()).toContain('ui-kit-input--base')
})

test('Applies correct text alignment class based on prop', () => {
  const wrapper = shallowMount(Input, {
    props: {
      textAlign: 'right'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input--text-right')
})

test('Applies correct size class based on prop', () => {
  const wrapper = shallowMount(Input, {
    props: {
      size: 'lg'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input--lg')
})

test('Accepts and displays a custom placeholder', () => {
  const wrapper = shallowMount(Input, {
    props: {
      placeholder: 'Enter your name'
    }
  })
  expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name')
})

test('Binds model value using v-model (initial + updates)', async () => {
  const wrapper = shallowMount(Input, {
    props: {
      value: 'Initial value'
    }
  })
  expect(wrapper.find('input').element.value).toBe('Initial value')

  await wrapper.find('input').setValue('Updated value')
  expect(wrapper.emitted('update:value')).toBeTruthy()
  expect(wrapper.emitted('update:value')[0]).toEqual(['Updated value'])
})

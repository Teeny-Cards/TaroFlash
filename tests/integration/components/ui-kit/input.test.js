import { shallowMount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Input from '@/components/ui-kit/input.vue'

test('renders the input element with default props', () => {
  const wrapper = shallowMount(Input)
  expect(wrapper.exists()).toBe(true)

  // Check the container element classes
  expect(wrapper.classes()).toContain('ui-kit-input-container')
  expect(wrapper.classes()).toContain('ui-kit-input-container--text-left')
  expect(wrapper.classes()).toContain('ui-kit-input-container--base')

  // Check that the input wrapper exists
  expect(wrapper.find('[data-testid="ui-kit-input"]').exists()).toBe(true)
  expect(wrapper.find('input').exists()).toBe(true)
})

test('Applies correct text alignment class based on prop', () => {
  const wrapper = shallowMount(Input, {
    props: {
      textAlign: 'right'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input-container--text-right')
})

test('Applies correct size class based on prop', () => {
  const wrapper = shallowMount(Input, {
    props: {
      size: 'lg'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input-container--lg')
})

test('Accepts and displays a custom placeholder', () => {
  const wrapper = shallowMount(Input, {
    props: {
      placeholder: 'Enter your name'
    }
  })
  expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name')
})

test('Displays label when provided', () => {
  const wrapper = shallowMount(Input, {
    props: {
      label: 'Username'
    }
  })
  expect(wrapper.find('span').text()).toBe('Username')
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

test('Applies center text alignment correctly', () => {
  const wrapper = shallowMount(Input, {
    props: {
      textAlign: 'center'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input-container--text-center')
})

test('Applies small size class correctly', () => {
  const wrapper = shallowMount(Input, {
    props: {
      size: 'sm'
    }
  })
  expect(wrapper.classes()).toContain('ui-kit-input-container--sm')
})

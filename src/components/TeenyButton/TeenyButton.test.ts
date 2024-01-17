import { mount } from '@vue/test-utils'
import TeenyButton from './TeenyButton.vue'
import { expect, test } from 'vitest'

test('It renders slot content', async () => {
  const wrapper = mount(TeenyButton, {
    slots: {
      default: 'Click Me'
    }
  })

  expect(wrapper.html()).toContain('Click Me')
})

test('It emits a click event', async () => {
  const wrapper = mount(TeenyButton)

  await wrapper.trigger('click')

  expect(wrapper.emitted()).toHaveProperty('onClick')
})

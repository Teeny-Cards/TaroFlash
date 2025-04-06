import { mount } from '@vue/test-utils'
import TeenyButton from '@teeny/TeenyButton.vue'
import { expect, test } from 'vitest'

test('It renders slot content', async () => {
  const wrapper = mount(TeenyButton, {
    slots: {
      default: 'Click Me'
    }
  })

  expect(wrapper.html()).toContain('Click Me')
})

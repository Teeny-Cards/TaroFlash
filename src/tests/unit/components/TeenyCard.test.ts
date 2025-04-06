import { mount } from '@vue/test-utils'
import TeenyCard from '@teeny/TeenyCard.vue'
import { expect, test } from 'vitest'

test('It renders slot content', async () => {
  const wrapper = mount(TeenyCard, {
    slots: {
      default: '<div class="test">Test</div>'
    }
  })

  expect(wrapper.html()).toContain('<div class="test">Test</div>')
})

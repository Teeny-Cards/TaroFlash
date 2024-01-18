import { mount } from '@vue/test-utils'
import TeenyCard from '@/components/TeenyCard.vue'
import { expect, test } from 'vitest'

test('It renders slot content', async () => {
  const wrapper = mount(TeenyCard, {
    slots: {
      default: '<div class="test">Test</div>'
    }
  })

  expect(wrapper.html()).toContain('<div class="test">Test</div>')
})

test('It renders a default size when no `size` prop is passed', async () => {
  const wrapper = mount(TeenyCard)

  expect(wrapper.classes()).toContain('w-card-base')
})

test('It renders small when passing `small` to the `size` prop', async () => {
  const wrapper = mount(TeenyCard, {
    props: { size: 'small' }
  })

  expect(wrapper.classes()).toContain('w-card-small')
})

test('It renders large when passing `large` to the `size` prop', async () => {
  const wrapper = mount(TeenyCard, {
    props: { size: 'large' }
  })

  expect(wrapper.classes()).toContain('w-card-large')
})

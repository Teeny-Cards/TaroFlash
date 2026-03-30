import { mount } from '@vue/test-utils'
import { expect, it } from 'vite-plus/test'
import Card from '@/components/card/index.vue'

it('renders front face by default', () => {
  const wrapper = mount(Card)
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)
})

it('renders back face when revealed', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').exists()).toBe(true)
})

it('shows front text when provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').text()).toBe('Test')
})

it('shows back text when provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').text()).toBe('Test')
})

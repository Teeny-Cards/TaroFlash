import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
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

it('shows front image when provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_image_url: 'https://via.placeholder.com/150'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"] img').exists()).toBe(true)
})

it('shows back image when provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_image_url: 'https://via.placeholder.com/150'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"] img').exists()).toBe(true)
})

it('renders front image and text when both provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_image_url: 'https://via.placeholder.com/150',
      front_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"] img').exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').text()).toBe('Test')
})

it('renders back image and text when both provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_image_url: 'https://via.placeholder.com/150',
      back_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"] img').exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').text()).toBe('Test')
})

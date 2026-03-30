import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vite-plus/test'
import GridItem from '@/views/deck/card-grid/grid-item.vue'
import { card } from '@tests/mocks/models/card'

beforeEach(() => {
  vi.clearAllMocks()
})

test('Renders base Card with passed props', () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'view',
      side: 'front',
      selected: false
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card"]').exists()).toBe(true)
})

test('Renders front face by default', () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'view',
      side: 'front',
      selected: false
    }
  })

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)
})

test('Renders back face when side is "back"', () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'view',
      side: 'back',
      selected: false
    }
  })

  expect(wrapper.find('[data-testid="card-face__back"]').exists()).toBe(true)
})

test('Does not show radio button in view mode', () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'view',
      side: 'front',
      selected: false
    }
  })

  expect(wrapper.find('[data-testid="ui-kit-radio"]').exists()).toBe(false)
})

test('Shows radio button in select mode', () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'select',
      side: 'front',
      selected: false
    }
  })

  expect(wrapper.find('[data-testid="ui-kit-radio"]').exists()).toBe(true)
})

test('Emits card-selected when radio is clicked in select mode', async () => {
  const newCard = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card: newCard,
      mode: 'select',
      side: 'front',
      selected: false
    }
  })

  await wrapper.find('[data-testid="ui-kit-radio"]').trigger('click')

  expect(wrapper.emitted('card-selected')).toBeTruthy()
})

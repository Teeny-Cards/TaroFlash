import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import { card } from '@tests/mocks/models/card'

let originalScrollIntoView

beforeEach(() => {
  originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView
})

test('renders empty state when there are no cards', () => {
  const wrapper = mount(CardList, {
    props: {
      cards: [],
      selectedCardIndices: [],
      mode: 'view'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-list__empty-state"]').exists()).toBe(true)
})

test('renders card list when there are cards', () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'view'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-list"]').exists()).toBe(true)
  expect(wrapper.findAll('[data-testid="card-list__item"]').length).toBe(3)
})

test('Emits card-activated event when card is focused', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'edit'
    }
  })

  await wrapper.find('[data-testid="front-input"]').trigger('focusin')

  expect(wrapper.emitted('card-activated')).toBeTruthy()
  expect(wrapper.emitted('card-activated')[0]).toEqual([0])
})

test('Emits card-deactivated event when card loses focus', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'edit'
    }
  })

  await wrapper.find('[data-testid="front-input"]').trigger('focusout')

  expect(wrapper.emitted('card-deactivated')).toBeTruthy()
  expect(wrapper.emitted('card-deactivated')[0]).toEqual([0])
})

test('Emits card-updated event when card input changes', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'edit'
    }
  })

  const frontInput = wrapper.find('[data-testid="front-input"]')
  await frontInput.setValue('New front text')
  await frontInput.trigger('input')

  expect(wrapper.emitted('card-updated')).toBeTruthy()
  expect(wrapper.emitted('card-updated')[0]).toEqual([0, 'front_text', 'New front text'])
})

test('Emits card-updated event when back input changes', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'edit'
    }
  })

  const backInput = wrapper.find('[data-testid="back-input"]')
  await backInput.setValue('New back text')
  await backInput.trigger('input')

  expect(wrapper.emitted('card-updated')).toBeTruthy()
  expect(wrapper.emitted('card-updated')[0]).toEqual([0, 'back_text', 'New back text'])
})

test('Emits card-deleted event when delete action is clicked', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'view'
    }
  })

  // Click the more button to open the dropdown
  await wrapper.find('[data-testid="card-list__item-more-button"]').trigger('click')

  // Wait for the dropdown to appear
  await wrapper.vm.$nextTick()

  // Find and click the delete button using data-action attribute
  const deleteButton = wrapper.find('[data-action="Delete"]')
  expect(deleteButton.exists()).toBe(true)

  await deleteButton.trigger('click')

  expect(wrapper.emitted('card-deleted')).toBeTruthy()
  expect(wrapper.emitted('card-deleted')[0]).toEqual([0])
})

test('Emits card-selected event when card is selected', async () => {
  const cards = card.many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      selectedCardIndices: [],
      mode: 'select'
    }
  })

  // Click on the list item to select it
  await wrapper.find('[data-testid="card-list__item"]').trigger('click')

  expect(wrapper.emitted('card-selected')).toBeTruthy()
  expect(wrapper.emitted('card-selected')[0]).toEqual([0])
})

test('Emits card-added event when empty state add card button is clicked', async () => {
  const wrapper = mount(CardList, {
    props: {
      cards: [],
      selectedCardIndices: [],
      mode: 'edit'
    }
  })

  await wrapper
    .find('[data-testid="card-list__empty-state"] [data-testid="ui-kit-button"]')
    .trigger('click')

  expect(wrapper.emitted('card-added')).toBeTruthy()
})

import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import { CardBuilder } from '@tests/mocks/models/card'

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
      editing: false
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-list__empty-state"]').exists()).toBe(true)
})

test('renders card list when there are cards', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-list"]').exists()).toBe(true)
  expect(wrapper.findAll('[data-testid="card-list__item"]').length).toBe(3)
})

test("Navigating 'down' moves current_card_index forward (if within bounds)", async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true }))
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.current_card_index).toBe(1)
})

test("Navigating 'up' moves current_card_index backward (if within bounds)", async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  wrapper.vm.current_card_index = 2

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true }))
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.current_card_index).toBe(1)
})

test('Does not update index if navigating flag is set', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  wrapper.vm.navigating = true
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true }))
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.current_card_index).toBe(0)
})

test('Does not update index if out of bounds', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  wrapper.vm.current_card_index = 2

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true }))
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.current_card_index).toBe(2)
})

test('Sets current card when and correct column when left card is focused', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: true
    }
  })

  wrapper.vm.current_card_index = 1

  await wrapper.find('[data-testid="card-list__item-front-input"]').trigger('focusin')

  expect(wrapper.vm.current_card_index).toBe(0)
  expect(wrapper.vm.current_column).toBe('front')
})

test('Sets current card when and correct column when right card is focused', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: true
    }
  })

  wrapper.vm.current_card_index = 1

  await wrapper.find('[data-testid="card-list__item-back-input"]').trigger('focusin')

  expect(wrapper.vm.current_card_index).toBe(0)
  expect(wrapper.vm.current_column).toBe('back')
})

test('Resets current card index when focusout event is emitted', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: true
    }
  })

  wrapper.vm.current_card_index = 1

  await wrapper.find('[data-testid="card-list__item-front-input"]').trigger('focusout')

  expect(wrapper.vm.current_card_index).toBe(-1)
})

test('Emits updated event when card is updated', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: true
    }
  })

  await wrapper.find('[data-testid="card-list__item-front-input"]').setValue('New Value')

  expect(wrapper.emitted('updated')).toBeTruthy()
  expect(wrapper.emitted('updated')[0]).toEqual([cards[0].id, 'front_text', 'New Value'])
})

test('Emits add-card event when add card button is clicked', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: true
    }
  })

  await wrapper.find('[data-testid="card-list__add-card-button"]').trigger('click')

  expect(wrapper.emitted('add-card')).toBeTruthy()
})

test('Emits cards-deleted event when card is deleted', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardList, {
    props: {
      cards,
      editing: false
    }
  })

  await wrapper.find('[data-testid="card-list__item-more-button"]').trigger('click')
  await wrapper.find('[data-action="Delete"]').trigger('click')

  expect(wrapper.emitted('cards-deleted')).toBeTruthy()
  expect(wrapper.emitted('cards-deleted')[0]).toEqual([[cards[0].id]])
})

test('Emits add-card event when empty state add card button is clicked', async () => {
  const wrapper = mount(CardList, {
    props: {
      cards: [],
      editing: true
    }
  })

  await wrapper
    .find('[data-testid="card-list__empty-state"] [data-testid="ui-kit-button"]')
    .trigger('click')

  expect(wrapper.emitted('add-card')).toBeTruthy()
})

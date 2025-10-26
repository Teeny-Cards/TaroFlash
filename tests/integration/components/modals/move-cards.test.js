import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import MoveCards from '@/components/modals/move-cards.vue'
import { card } from '@tests/mocks/models/card'
import { deck } from '@tests/mocks/models/deck'

const member_decks = deck.many(3)
const mocks = vi.hoisted(() => {
  return {
    fetchMemberDecks: vi.fn(() => member_decks)
  }
})

vi.mock('@/api/decks', () => ({
  fetchMemberDecks: mocks.fetchMemberDecks
}))

it('renders properly with default props', () => {
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close: vi.fn()
    }
  })

  expect(wrapper.exists()).toBe(true)
})

it('renders properly with cards', () => {
  const cards = card.many(3)
  const wrapper = mount(MoveCards, {
    props: {
      cards,
      current_deck_id: 0,
      close: vi.fn()
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="move-cards__header"] h1').text()).toContain('3')
})

it('renders properly with current_deck_id', async () => {
  const cards = card.many(3)
  const wrapper = mount(MoveCards, {
    props: {
      cards,
      current_deck_id: member_decks[0].id,
      close: vi.fn()
    }
  })

  await Promise.resolve() // Wait for async operations
  await wrapper.vm.$nextTick() // Wait for component to update

  const listItems = wrapper.findAll(
    '[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]'
  )

  expect(listItems.length).toBe(3)
  expect(listItems[0].classes()).toContain('ui-kit-list-item--disabled')
  expect(listItems[1].classes()).not.toContain('ui-kit-list-item--disabled')
  expect(listItems[2].classes()).not.toContain('ui-kit-list-item--disabled')
})

it('calls close function when cancel button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close
    }
  })

  await wrapper.find('[data-testid="move-cards__cancel"]').trigger('click')

  expect(close).toHaveBeenCalledWith(false)
})

it('calls close function with deck_id when move button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close
    }
  })

  await Promise.resolve() // Wait for async operations
  await wrapper.vm.$nextTick() // Wait for component to update

  await wrapper
    .find('[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]')
    .trigger('click')
  await wrapper.find('[data-testid="move-cards__move"]').trigger('click')

  expect(close).toHaveBeenCalledWith({ deck_id: expect.any(Number) })
})

it('does not call close function with false when move button is clicked and no deck is selected', async () => {
  const close = vi.fn()
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close
    }
  })

  await wrapper.find('[data-testid="move-cards__move"]').trigger('click')

  expect(close).not.toHaveBeenCalledWith({ deck_id: expect.any(Number) })
})

it('sets deck_id when list item is clicked', async () => {
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close: vi.fn()
    }
  })

  await Promise.resolve() // Wait for async operations
  await wrapper.vm.$nextTick() // Wait for component to update

  await wrapper
    .find('[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]')
    .trigger('click')

  expect(wrapper.vm.selected_deck_id).toBe(member_decks[0].id)
})

it('unsets deck_id when list item is clicked again', async () => {
  const wrapper = mount(MoveCards, {
    props: {
      cards: [],
      current_deck_id: 0,
      close: vi.fn()
    }
  })

  await Promise.resolve() // Wait for async operations
  await wrapper.vm.$nextTick() // Wait for component to update

  await wrapper
    .find('[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]')
    .trigger('click')
  await wrapper
    .find('[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]')
    .trigger('click')

  expect(wrapper.vm.selected_deck_id).toBeUndefined()
})

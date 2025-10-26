import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import MoveCards from '@/components/modals/move-cards.vue'
import { card } from '@tests/mocks/models/card'
import { deck } from '@tests/mocks/models/deck'

const member_decks = deck.many(3)
const mocks = vi.hoisted(() => {
  return {
    fetchMemberDecks: vi.fn(() => member_decks),
    close: vi.fn()
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
      close: mocks.close
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
      close: mocks.close
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="move-cards__header"] h1').text()).toContain('3')
})

it('renders properly with current_deck_id', () => {
  const cards = card.many(3)
  const wrapper = mount(MoveCards, {
    props: {
      cards,
      current_deck_id: member_decks[0].id,
      close: mocks.close
    }
  })

  console.log(wrapper.html())

  expect(
    wrapper
      .findAll('[data-testid="move-cards__deck-list"] [data-testid="ui-kit-list-item"]')[0]
      .attributes('disabled')
  ).toBe('true')
})

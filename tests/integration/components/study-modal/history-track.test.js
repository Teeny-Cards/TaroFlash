import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import HistoryTrack from '@/components/study-modal/history-track.vue'
import { CardBuilder } from '@tests/mocks/models/card'

it('renders correctly with no cards', () => {
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards: [],
      studiedCardIds: new Set(),
      failedCardIds: new Set(),
      currentCard: undefined
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="history-track"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="history-track__count"]').exists()).toBe(true)
})

it('renders multiple cards with default (unstudied) state', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards,
      studiedCardIds: new Set(),
      failedCardIds: new Set(),
      currentCard: undefined
    }
  })

  expect(wrapper.findAll('button').length).toBe(3)
  expect(
    wrapper.findAll('button').every((button) => button.classes().includes('bg-brown-100'))
  ).toBe(true)
})

it('renders a studied card correctly', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards,
      studiedCardIds: new Set([cards[1].id]),
      failedCardIds: new Set(),
      currentCard: undefined
    }
  })

  expect(wrapper.findAll('button').length).toBe(3)
  expect(wrapper.findAll('button')[1].classes()).toContain('!bg-purple-400')
})

it('renders a failed card correctly', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards,
      studiedCardIds: new Set(),
      failedCardIds: new Set([cards[1].id]),
      currentCard: undefined
    }
  })

  expect(wrapper.findAll('button').length).toBe(3)
  expect(wrapper.findAll('button')[1].classes()).toContain('!bg-grey-300')
})

it('renders the active card correctly', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards,
      studiedCardIds: new Set(),
      failedCardIds: new Set(),
      currentCard: cards[0]
    }
  })

  expect(wrapper.findAll('button').length).toBe(3)
  expect(wrapper.findAll('button')[0].classes()).toContain('!bg-purple-500')
})

it('Emits card-clicked event on button click', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(HistoryTrack, {
    global: {
      stubs: {
        'ui-kit:tooltip': true
      }
    },
    props: {
      cards,
      studiedCardIds: new Set(),
      failedCardIds: new Set(),
      currentCard: undefined
    }
  })

  wrapper.findAll('button')[1].trigger('click')
  expect(wrapper.emitted('card-clicked')).toBeTruthy()
  expect(wrapper.emitted('card-clicked')[0]).toEqual([cards[1]])
})

// Tooltip shows '?' for cards not studied/failed/active
// Tooltip shows card.front_text if card is studied
// Tooltip shows card.front_text if card is failed
// Tooltip shows card.front_text if card is currentCard

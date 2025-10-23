import { mount } from '@vue/test-utils'
import { expect, it, vi, beforeEach } from 'vitest'
import StudySession from '@/components/modals/study-session/index.vue'
import { deck } from '@tests/mocks/models/deck'
import { card } from '@tests/mocks/models/card'
import { createTestingPinia } from '@pinia/testing'
import { DateTime } from 'luxon'

const mocks = vi.hoisted(() => {
  return {
    updateReviewByCardId: vi.fn(),
    fetchDueCardsByDeckId: vi.fn(),
    fetchAllCardsByDeckId: vi.fn()
  }
})

vi.mock('@/api/reviews', () => ({
  updateReviewByCardId: mocks.updateReviewByCardId
}))

vi.mock('@/api/cards', () => ({
  fetchDueCardsByDeckId: mocks.fetchDueCardsByDeckId,
  fetchAllCardsByDeckId: mocks.fetchAllCardsByDeckId
}))

beforeEach(() => {
  vi.clearAllMocks()
})

async function mountStudySession(_deck) {
  const newDeck = _deck ?? deck.one({ traits: 'with_some_due_cards' })

  mocks.fetchAllCardsByDeckId.mockResolvedValue(newDeck.cards)
  mocks.fetchDueCardsByDeckId.mockResolvedValue(
    newDeck.cards.filter((c) => {
      if (!c.review) return true

      const due_date = DateTime.fromISO(c.review.due)
      return due_date.endOf('day') <= DateTime.now().endOf('day')
    })
  )

  const wrapper = mount(StudySession, {
    props: {
      close: vi.fn(),
      deck: newDeck
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.vm.$nextTick()
  return wrapper
}

it('displays deck title in header', async () => {
  const newDeck = deck.one({ traits: 'with_some_due_cards' })
  const wrapper = await mountStudySession(newDeck)
  expect(wrapper.find('[data-testid="study-session__header"]').text()).toContain(newDeck.title)
})

it('shows first card in hidden state when first opened', async () => {
  const wrapper = await mountStudySession()

  // Both cards should show their front faces initially (hidden state)
  expect(wrapper.findAll('[data-testid="card-face__front"]').length).toBe(2)
  expect(wrapper.findAll('[data-testid="card-face__back"]').length).toBe(0)
})

it('only studys cards due today when study_all_cards is false', async () => {
  const newDeck = deck.one({ traits: 'with_some_due_cards' })
  const wrapper = await mountStudySession(newDeck)

  expect(wrapper.findAll('[data-testid="history-track__card"]').length).not.toBe(
    newDeck.cards.length
  )
})

it('studys all cards when study_all_cards is true', async () => {
  const newDeck = deck.one({
    overrides: { config: { study_all_cards: true } },
    traits: 'with_some_due_cards'
  })
  const wrapper = await mountStudySession(newDeck)

  expect(wrapper.findAll('[data-testid="history-track__card"]').length).toBe(newDeck.cards.length)
})

it('does not retry failed cards when retry_failed_cards is false', async () => {
  const newDeck = deck.one({
    overrides: { config: { retry_failed_cards: false, study_all_cards: true } },
    traits: 'with_cards'
  })
  const wrapper = await mountStudySession(newDeck)

  expect(wrapper.findAll('[data-testid="history-track__card"]').length).toBe(newDeck.cards.length)

  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')

  expect(wrapper.findAll('[data-testid="history-track__card"]').length).toBe(newDeck.cards.length)
})

it('sends review to backend when card is reviewed', async () => {
  const wrapper = await mountStudySession()
  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')

  expect(mocks.updateReviewByCardId).toHaveBeenCalled()
})

// tooltip shows card front text for studied/failed/active cards
// tooltip shows '?' for unstudied cards

it('shows first card as active in history track', async () => {
  const newDeck = deck.one({ traits: 'with_some_due_cards' })
  const wrapper = await mountStudySession(newDeck)

  expect(
    wrapper
      .findAll('[data-testid="history-track__card"]')
      .at(0)
      .classes('history-track__card--active')
  ).toBe(true)
})

it('shows a previously studied card in preview mode when clicked in history track', async () => {
  const cards = card.many(5, { traits: ['passed', 'with_due_review'] })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  expect(historyCards.at(1).classes('history-track__card--passed')).toBe(true)

  await historyCards.at(1).trigger('click')
  expect(historyCards.at(1).classes('history-track__card--previewing')).toBe(true)
})

it('returns to study mode when the active card is clicked in history track', async () => {
  const cards = card.many(5, { traits: ['passed', 'with_due_review'] })
  const active_card = card.one({ traits: 'with_due_review' })
  const newDeck = deck.one({ overrides: { cards: [...cards, active_card] } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  expect(wrapper.attributes('data-mode')).toBe('studying')

  await historyCards.at(1).trigger('click')

  expect(wrapper.attributes('data-mode')).toBe('previewing')

  await historyCards.at(-1).trigger('click')

  expect(wrapper.attributes('data-mode')).toBe('studying')
})

it('passed cards are marked in history track', async () => {
  const cards = card.many(5, { traits: ['passed', 'with_due_review'] })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  historyCards.forEach((card) => {
    expect(card.classes('history-track__card--passed')).toBe(true)
  })
})

it('failed cards are marked in history track', async () => {
  const cards = card.many(5, { traits: ['failed', 'with_due_review'] })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  historyCards.forEach((card) => {
    expect(card.classes('history-track__card--failed')).toBe(true)
  })
})

it('active card is marked in history track', async () => {
  const cards = card.many(5, { traits: 'with_due_review' })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  expect(historyCards.at(0).classes('history-track__card--active')).toBe(true)
})

it('cannot preview a card that has not been studied', async () => {
  const cards = card.many(5, { traits: 'with_due_review' })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)
  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')

  await historyCards.at(1).trigger('click')

  expect(wrapper.attributes('data-mode')).toBe('studying')
})

it('shows reveal button when card is hidden', async () => {
  const wrapper = await mountStudySession()
  expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(true)
})

it('shows rating options when card is revealed', async () => {
  const wrapper = await mountStudySession()
  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  expect(wrapper.find('[data-testid="rating-buttons__good"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(true)
})

it('rating options are shown and disabled when in preview mode', async () => {
  const cards = card.many(5, { traits: ['passed', 'with_due_review'] })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)

  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')

  expect(
    wrapper.find('[data-testid="rating-buttons__good"]').attributes('disabled')
  ).toBeUndefined()
  expect(
    wrapper.find('[data-testid="rating-buttons__again"]').attributes('disabled')
  ).toBeUndefined()

  const historyCards = wrapper.findAll('[data-testid="history-track__card"]')
  await historyCards.at(1).trigger('click')

  expect(wrapper.find('[data-testid="rating-buttons__good"]').attributes('disabled')).toBe('')
  expect(wrapper.find('[data-testid="rating-buttons__again"]').attributes('disabled')).toBe('')
})

it('reveals card when reveal button is clicked', async () => {
  const cards = card.many(5, { traits: 'with_due_review' })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)

  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  await new Promise((resolve) => setTimeout(resolve, 200))

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(false)
})

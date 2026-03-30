import { mount } from '@vue/test-utils'
import { expect, it, vi, beforeEach } from 'vite-plus/test'
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

it('only studys cards due today when study_all_cards is false', async () => {
  const newDeck = deck.one({ traits: 'with_some_due_cards' })
  const wrapper = await mountStudySession(newDeck)

  expect(mocks.fetchDueCardsByDeckId).toHaveBeenCalled()
  expect(mocks.fetchAllCardsByDeckId).not.toHaveBeenCalled()
})

it('sends review to backend when card is reviewed', async () => {
  const wrapper = await mountStudySession()
  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')

  expect(mocks.updateReviewByCardId).toHaveBeenCalled()
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

it('reveals card when reveal button is clicked', async () => {
  const cards = card.many(5, { traits: 'with_due_review' })
  const newDeck = deck.one({ overrides: { cards } })
  const wrapper = await mountStudySession(newDeck)

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)

  await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
  await new Promise((resolve) => setTimeout(resolve, 200))

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(false)
})

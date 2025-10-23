import { expect, test, describe, vi, beforeEach } from 'vitest'
import { useStudySession } from '@/composables/use-study-session'
import { card, review } from '@tests/mocks/models/card'
import { Rating } from 'ts-fsrs'

const mocks = vi.hoisted(() => {
  return {
    updateReviewByCardId: vi.fn(),
    fetchAllCardsByDeckId: vi.fn(),
    fetchDueCardsByDeckId: vi.fn()
  }
})

vi.mock('@/api/reviews', () => ({
  updateReviewByCardId: mocks.updateReviewByCardId
}))

vi.mock('@/api/cards', () => ({
  fetchAllCardsByDeckId: mocks.fetchAllCardsByDeckId,
  fetchDueCardsByDeckId: mocks.fetchDueCardsByDeckId
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const config = {
  study_all_cards: true,
  retry_failed_cards: true
}

function setFetchCardsMock(cards) {
  mocks.fetchAllCardsByDeckId.mockResolvedValue(cards)
  mocks.fetchDueCardsByDeckId.mockResolvedValue(cards)
}

test('initializes with default state', () => {
  const { mode, current_card_state, cards, current_card } = useStudySession(config)

  expect(mode.value).toBe('studying')
  expect(current_card_state.value).toBe('hidden')
  expect(cards.value).toHaveLength(0)
  expect(current_card.value).toBeUndefined()
})

// FUNCTION TESTS - await setup()
describe('setup', () => {
  test('Setup creates review objects for cards that are missing them', async () => {
    const { setup, cards } = useStudySession(config)
    const deck_cards = card.many(2)

    expect(deck_cards[0].review).toBeUndefined()
    expect(deck_cards[1].review).toBeUndefined()

    setFetchCardsMock(deck_cards)
    await setup()

    expect(cards.value[0].review).toBeDefined()
    expect(cards.value[1].review).toBeDefined()
  })

  test('When study_all_cards is true, all input cards are set', async () => {
    const deck_cards = card.many(3)
    const { setup, cards } = useStudySession({ study_all_cards: true })

    setFetchCardsMock(deck_cards)
    await setup()
    expect(cards.value.length).toEqual(deck_cards.length)
  })

  test('Sets active_card', async () => {
    const { setup, active_card } = useStudySession(config)
    const cards = card.many(3, { traits: 'with_due_review' })

    setFetchCardsMock(cards)
    await setup()
    expect(active_card.value).toMatchObject(cards[0])
  })
})

describe('reviewCard', () => {
  test('Marks active card as passed when reviewed with Good', async () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = card.many(3)

    setFetchCardsMock(cards)
    await setup()
    const newCard = active_card

    expect(newCard.value.state).toBe('unreviewed')

    reviewCard(newCard.value.preview[Rating.Good])

    expect(newCard.value.state).toBe('passed')
  })

  test('Marks active card as failed when reviewed with Again', async () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = card.many(3)

    setFetchCardsMock(cards)
    await setup()
    const newCard = active_card

    expect(newCard.value.state).toBe('unreviewed')

    reviewCard(newCard.value.preview[Rating.Again])

    expect(newCard.value.state).toBe('failed')
  })

  // TODO: FLAKY TEST, FIX LATER

  // test('Adds to retry cards if reviewed with Again and due today and retry_failed_cards is true', () => {
  //   const { setup, reviewCard, active_card, cards } = useStudySession(config)
  //   const deck_cards = card.many(3, { traits: 'with_due_review' })

  //   setup(deck_cards)
  //   const card = active_card

  //   expect(cards.value.length).toBe(3)

  //   const review = review.one({ traits: 'due_today' })
  //   reviewCard({ ...card.value.preview[Rating.Again], card: review })

  //   expect(cards.value.length).toBe(4)
  // })

  test('Does not add to retry cards if reviewed with Again and due today and retry_failed_cards is false', async () => {
    const { setup, reviewCard, active_card, cards } = useStudySession({
      ...config,
      retry_failed_cards: false
    })
    const deck_cards = card.many(3, { traits: 'with_due_review' })

    setFetchCardsMock(deck_cards)
    await setup()
    const newCard = active_card

    expect(cards.value.length).toBe(3)

    const newReview = review.one({ traits: 'due_today' })
    reviewCard({ ...newCard.value.preview[Rating.Again], card: newReview })

    expect(cards.value.length).toBe(3)
  })

  test('Sends review to backend', async () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = card.many(3)

    setFetchCardsMock(cards)
    await setup()
    const newCard = active_card

    reviewCard(newCard.value.preview[Rating.Good])

    expect(mocks.updateReviewByCardId).toHaveBeenCalledWith(newCard.value.id, newCard.value.review)
  })
})

describe('pickNextCard', () => {
  test('Picks the next unstudied/unfailed card', async () => {
    const { setup, pickNextCard, active_card, reviewCard } = useStudySession(config)
    const failed_card = card.one({ traits: 'failed' })
    const unreviewed_cards = card.many(3)
    const cards = [failed_card, ...unreviewed_cards]

    setFetchCardsMock(cards)
    await setup()

    expect(active_card.value.id).toEqual(unreviewed_cards[0].id)

    reviewCard(active_card.value.preview[Rating.Good]) // mark as passed
    pickNextCard()

    expect(unreviewed_cards[1].id).toEqual(active_card.value.id)
  })

  test("Resets current_card_state to 'hidden'", async () => {
    const { setup, pickNextCard, current_card_state } = useStudySession(config)
    const cards = card.many(3)

    setFetchCardsMock(cards)
    await setup()
    pickNextCard()

    current_card_state.value = 'revealed'
    expect(current_card_state.value).toBe('revealed')

    pickNextCard()

    expect(current_card_state.value).toBe('hidden')
  })
})

describe('setPreviewCard', () => {
  test('Sets preview_card and mode to "previewing" if card is studied', async () => {
    const { setup, setPreviewCard, mode, preview_card } = useStudySession(config)

    const cards = card.many(3, { traits: 'passed' })
    setFetchCardsMock(cards)
    await setup()

    setPreviewCard(cards[2])

    expect(mode.value).toBe('previewing')
    expect(preview_card.value).toBeDefined()
  })

  test('Resets preview_card and sets mode to "studying" if card is not studied', async () => {
    const { setup, setPreviewCard, mode, preview_card } = useStudySession(config)

    const cards = card.many(3)
    setFetchCardsMock(cards)
    await setup()

    setPreviewCard(cards[2])

    expect(mode.value).toBe('studying')
    expect(preview_card.value).toBeUndefined()
  })
})

describe('current_card', () => {
  test("Returns _preview_card when view_state is 'previewing'", async () => {
    const { setup, setPreviewCard, current_card, preview_card } = useStudySession(config)
    const cards = card.many(3, { traits: 'passed' })

    setFetchCardsMock(cards)
    await setup()

    setPreviewCard(cards[2])

    expect(current_card.value).toEqual(preview_card.value)
  })

  test("Returns _active_card when view_state is 'studying'", async () => {
    const { setup, current_card, active_card } = useStudySession(config)
    const cards = card.many(3)

    setFetchCardsMock(cards)
    await setup()

    expect(current_card.value).toEqual(active_card.value)
  })
})

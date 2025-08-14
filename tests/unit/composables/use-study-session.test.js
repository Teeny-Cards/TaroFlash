import { expect, test, describe, vi } from 'vitest'
import { useStudySession } from '@/composables/use-study-session'
import { CardBuilder, ReviewBuilder } from '@tests/mocks/models/card'
import { Rating } from 'ts-fsrs'
import { DateTime } from 'luxon'

const mocks = vi.hoisted(() => {
  return {
    updateReviewByCardId: vi.fn()
  }
})

vi.mock('@/api/reviews', () => ({
  updateReviewByCardId: mocks.updateReviewByCardId
}))

const config = {
  study_all_cards: true,
  retry_failed_cards: true
}

test('initializes with default state', () => {
  const { mode, current_card_state, cards, current_card } = useStudySession(config)

  expect(mode.value).toBe('studying')
  expect(current_card_state.value).toBe('hidden')
  expect(cards.value).toHaveLength(0)
  expect(current_card.value).toBeUndefined()
})

// FUNCTION TESTS - setup()
describe('setup', () => {
  test('Setup creates review objects for cards that are missing them', () => {
    const { setup, cards } = useStudySession(config)
    const deck_cards = CardBuilder().many(2)

    expect(deck_cards[0].review).toBeUndefined()
    expect(deck_cards[1].review).toBeUndefined()

    setup(deck_cards)

    expect(cards.value[0].review).toBeDefined()
    expect(cards.value[1].review).toBeDefined()
  })

  test('When study_all_cards is true, all input cards are set', () => {
    const deck_cards = CardBuilder().many(3)
    const { setup, cards } = useStudySession({ study_all_cards: true })

    setup(deck_cards)
    expect(cards.value.length).toEqual(deck_cards.length)
  })

  test('When study_all_cards is false and cards are due in future, they are filtered out', () => {
    const { cards, setup } = useStudySession({ study_all_cards: false })
    const due_cards = CardBuilder().one({ traits: 'with_due_review' })
    const not_due_cards = CardBuilder().one({ traits: 'with_not_due_review' })

    setup([due_cards, not_due_cards])

    expect(cards.value.length).toEqual(1)
  })

  test('Sets active_card', () => {
    const { setup, active_card } = useStudySession(config)
    const cards = CardBuilder().many(3, { traits: 'with_due_review' })

    setup(cards)
    expect(active_card.value).toMatchObject(cards[0])
  })
})

describe('reviewCard', () => {
  test('Marks active card as passed when reviewed with Good', () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = CardBuilder().many(3)

    setup(cards)
    const card = active_card

    expect(card.value.state).toBe('unreviewed')

    reviewCard(card.value.preview[Rating.Good])

    expect(card.value.state).toBe('passed')
  })

  test('Marks active card as failed when reviewed with Again', () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = CardBuilder().many(3)

    setup(cards)
    const card = active_card

    expect(card.value.state).toBe('unreviewed')

    reviewCard(card.value.preview[Rating.Again])

    expect(card.value.state).toBe('failed')
  })

  // TODO: FLAKY TEST, FIX LATER

  // test('Adds to retry cards if reviewed with Again and due today and retry_failed_cards is true', () => {
  //   const { setup, reviewCard, active_card, cards } = useStudySession(config)
  //   const deck_cards = CardBuilder().many(3, { traits: 'with_due_review' })

  //   setup(deck_cards)
  //   const card = active_card

  //   expect(cards.value.length).toBe(3)

  //   const review = ReviewBuilder().one({ traits: 'due_today' })
  //   reviewCard({ ...card.value.preview[Rating.Again], card: review })

  //   expect(cards.value.length).toBe(4)
  // })

  test('Does not add to retry cards if reviewed with Again and due today and retry_failed_cards is false', () => {
    const { setup, reviewCard, active_card, cards } = useStudySession({
      ...config,
      retry_failed_cards: false
    })
    const deck_cards = CardBuilder().many(3, { traits: 'with_due_review' })

    setup(deck_cards)
    const card = active_card

    expect(cards.value.length).toBe(3)

    const review = ReviewBuilder().one({ traits: 'due_today' })
    reviewCard({ ...card.value.preview[Rating.Again], card: review })

    expect(cards.value.length).toBe(3)
  })

  test('Sends review to backend', () => {
    const { setup, reviewCard, active_card } = useStudySession(config)
    const cards = CardBuilder().many(3)

    setup(cards)
    const card = active_card

    reviewCard(card.value.preview[Rating.Good])

    expect(mocks.updateReviewByCardId).toHaveBeenCalledWith(card.value.id, card.value.review)
  })
})

describe('pickNextCard', () => {
  test('Picks the next unstudied/unfailed card', async () => {
    const { setup, pickNextCard, active_card, reviewCard } = useStudySession(config)
    const failed_card = CardBuilder().one({ traits: 'failed' })
    const unreviewed_cards = CardBuilder().many(3)
    const cards = [failed_card, ...unreviewed_cards]

    setup(cards)

    expect(active_card.value.id).toEqual(unreviewed_cards[0].id)

    reviewCard(active_card.value.preview[Rating.Good]) // mark as passed
    pickNextCard()

    expect(unreviewed_cards[1].id).toEqual(active_card.value.id)
  })

  test("Resets current_card_state to 'hidden'", () => {
    const { setup, pickNextCard, current_card_state } = useStudySession(config)
    const cards = CardBuilder().many(3)

    setup(cards)
    pickNextCard()

    current_card_state.value = 'revealed'
    expect(current_card_state.value).toBe('revealed')

    pickNextCard()

    expect(current_card_state.value).toBe('hidden')
  })
})

describe('setPreviewCard', () => {
  test('Sets preview_card and mode to "previewing" if card is studied', () => {
    const { setup, setPreviewCard, mode, preview_card } = useStudySession(config)

    const cards = CardBuilder().many(3, { traits: 'passed' })
    setup(cards)

    setPreviewCard(cards[2])

    expect(mode.value).toBe('previewing')
    expect(preview_card.value).toBeDefined()
  })

  test('Resets preview_card and sets mode to "studying" if card is not studied', () => {
    const { setup, setPreviewCard, mode, preview_card } = useStudySession(config)

    const cards = CardBuilder().many(3)
    setup(cards)

    setPreviewCard(cards[2])

    expect(mode.value).toBe('studying')
    expect(preview_card.value).toBeUndefined()
  })
})

describe('current_card', () => {
  test("Returns _preview_card when view_state is 'previewing'", () => {
    const { setup, setPreviewCard, current_card, preview_card } = useStudySession(config)
    const cards = CardBuilder().many(3, { traits: 'passed' })

    setup(cards)

    setPreviewCard(cards[2])

    expect(current_card.value).toEqual(preview_card.value)
  })

  test("Returns _active_card when view_state is 'studying'", () => {
    const { setup, current_card, active_card } = useStudySession(config)
    const cards = CardBuilder().many(3)

    setup(cards)

    expect(current_card.value).toEqual(active_card.value)
  })
})

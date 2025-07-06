import { expect, test, describe } from 'vitest'
import { useStudySession } from '@/composables/use-study-session'
import { CardBuilder } from '@tests/mocks/models/card'
import { DateTime } from 'luxon'

describe('Initial State', () => {
  test('initializes with default state', () => {
    const {
      view_state,
      current_card_state,
      cards_in_deck,
      studied_card_ids,
      failed_card_ids,
      current_card,
      active_card_review_options
    } = useStudySession()

    expect(view_state.value).toBe('studying')
    expect(current_card_state.value).toBe('hidden')
    expect(cards_in_deck.value).toHaveLength(0)
    expect(studied_card_ids.value).toHaveLength(0)
    expect(failed_card_ids.value).toHaveLength(0)
    expect(current_card.value).toBeUndefined()
    expect(active_card_review_options.value).toBeUndefined()
  })
})

describe('setupStudySession', () => {
  test('When study_all_cards is true, all input cards are set', () => {
    const { setupStudySession, cards_in_deck } = useStudySession()
    const cards = CardBuilder().many(3, { traits: 'with_review' })

    setupStudySession(cards, { study_all_cards: true })
    expect(cards_in_deck.value).toEqual(cards)
  })

  test('When study_all_cards is false and cards have due in future, they are filtered out', () => {
    const { setupStudySession, cards_in_deck } = useStudySession()
    const cards = CardBuilder().many(3, { traits: 'with_review' })

    const today = DateTime.now().toISO()

    cards[0].review.due = today
    cards[1].review = undefined

    setupStudySession(cards)

    expect(cards_in_deck.value).toEqual([cards[0], cards[1]])
  })
})

describe('startSession', () => {
  test('Sets _active_card', () => {
    const { setupStudySession, startSession, current_card } = useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    expect(current_card.value).toEqual(cards[0])
  })
})

describe('advanceToNextCard', () => {
  test('Adds current card to studied_card_ids by default', () => {
    const { setupStudySession, startSession, advanceToNextCard, studied_card_ids } =
      useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    expect(studied_card_ids.value).toHaveLength(0)

    advanceToNextCard()

    expect(studied_card_ids.value).toHaveLength(1)
    expect(studied_card_ids.value).toContain(cards[0].id)
  })

  test('Adds current card to failed_card_ids if rating is Again', () => {
    const { setupStudySession, startSession, advanceToNextCard, failed_card_ids } =
      useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    expect(failed_card_ids.value).toHaveLength(0)

    advanceToNextCard(1)

    expect(failed_card_ids.value).toHaveLength(1)
    expect(failed_card_ids.value).toContain(cards[0].id)
  })

  test('Picks the next unstudied/unfailed card', () => {
    const { setupStudySession, startSession, advanceToNextCard, current_card, failed_card_ids } =
      useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    failed_card_ids.value.add(cards[1].id)

    expect(current_card.value).toEqual(cards[0])

    advanceToNextCard()

    expect(current_card.value).toEqual(cards[2])
  })

  test('Creates a review object if it’s missing on the next card', () => {
    const { setupStudySession, startSession, advanceToNextCard, current_card } = useStudySession()
    const cards = CardBuilder().many(3)

    expect(cards[0].review).toBeUndefined()
    expect(cards[1].review).toBeUndefined()
    expect(cards[2].review).toBeUndefined()

    setupStudySession(cards)
    startSession()

    expect(current_card.value.review).toBeDefined()

    advanceToNextCard()

    expect(current_card.value.review).toBeDefined()
  })

  test("Resets current_card_state to 'hidden'", () => {
    const { setupStudySession, startSession, advanceToNextCard, current_card_state } =
      useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    current_card_state.value = 'revealed'

    advanceToNextCard()

    expect(current_card_state.value).toBe('hidden')
  })

  test('Computes review options for active card', () => {
    const { setupStudySession, startSession, advanceToNextCard, active_card_review_options } =
      useStudySession()
    const cards = CardBuilder().many(3)

    expect(active_card_review_options.value).toBeUndefined()

    setupStudySession(cards)
    startSession()

    expect(active_card_review_options.value).toBeDefined()
  })
})

describe('setPreviewCard', () => {
  test('Sets _preview_card and view_state to "previewing" if card is studied', () => {
    const {
      setupStudySession,
      startSession,
      setPreviewCard,
      view_state,
      current_card,
      studied_card_ids
    } = useStudySession()

    const cards = CardBuilder().many(3)
    setupStudySession(cards)
    startSession()

    studied_card_ids.value.add(cards[2].id)

    setPreviewCard(cards[2])

    expect(view_state.value).toBe('previewing')
    expect(current_card.value).toEqual(cards[2])
  })

  test('Resets _preview_card and sets view_state to "studying" if card is not studied', () => {
    const { setupStudySession, startSession, setPreviewCard, view_state, current_card } =
      useStudySession()

    const cards = CardBuilder().many(3)
    setupStudySession(cards)
    startSession()

    view_state.value = 'previewing'
    current_card.value = cards[2]

    setPreviewCard(cards[2])

    expect(view_state.value).toBe('studying')
    expect(current_card.value).toEqual(cards[0])
  })
})

describe('current_card (computed)', () => {
  test("Returns _active_card when view_state is 'studying'", () => {
    const { setupStudySession, startSession, current_card, view_state } = useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    expect(current_card.value).toEqual(cards[0])

    view_state.value = 'previewing'

    expect(current_card.value).toBeUndefined()
  })

  test("Returns _preview_card when view_state is 'previewing'", () => {
    const { setupStudySession, startSession, setPreviewCard, current_card, studied_card_ids } =
      useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    studied_card_ids.value.add(cards[2].id)

    setPreviewCard(cards[2])

    expect(current_card.value).toEqual(cards[2])
  })
})

describe('active_card_review_options (computed)', () => {
  test('Returns undefined if _active_card or id is missing', () => {
    const { active_card_review_options } = useStudySession()
    expect(active_card_review_options.value).toBeUndefined()
  })

  test('Returns correct preview object from _active_card_review_options', () => {
    const { setupStudySession, startSession, active_card_review_options } = useStudySession()
    const cards = CardBuilder().many(3)

    setupStudySession(cards)
    startSession()

    expect(active_card_review_options.value).toBeDefined()
  })
})

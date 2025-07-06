import { expect, test, describe } from 'vitest'
import { useEditableCards } from '@/composables/use-editable-cards'
import { CardBuilder } from '@tests/mocks/models/card'

describe('Initialization', () => {
  test('Initializes editedCards with copies of initialCards', () => {
    const initialCards = CardBuilder().many(3)
    const { editedCards } = useEditableCards(initialCards)

    expect(editedCards).toHaveLength(3)
    expect(editedCards[0]).not.toBe(initialCards[0])
    expect(editedCards[0]).toEqual(initialCards[0])
  })

  test('Initializes dirtyMap as empty', () => {
    const { dirtyMap } = useEditableCards(CardBuilder().many(3))
    expect(dirtyMap.size).toBe(0)
  })

  test('isDirty is false initially', () => {
    const { isDirty } = useEditableCards(CardBuilder().many(3))
    expect(isDirty.value).toBe(false)
  })
})

describe('addCard', () => {
  test('Adds a new card with empty front_text/back_text at start of editedCards', () => {
    const { editedCards, addCard } = useEditableCards(CardBuilder().many(3))
    const max = Math.max(...editedCards.map((card) => card.order ?? 0)) + 1

    addCard()

    expect(editedCards[0]).toEqual({
      front_text: '',
      back_text: '',
      order: max
    })
  })

  test('New card includes deck_id if provided', () => {
    const { editedCards, addCard } = useEditableCards(CardBuilder().many(3), 1)

    addCard()

    expect(editedCards[0].deck_id).toBe(1)
  })

  test('When initialCards is empty, first added card gets order = 1', () => {
    const { editedCards, addCard } = useEditableCards([])

    addCard()

    expect(editedCards[0].order).toBe(1)
  })
})

describe('updateCard', () => {
  test('Updates matching card’s key with new value', () => {
    const initialCards = CardBuilder().many(3)
    const { editedCards, updateCard } = useEditableCards(initialCards)

    expect(editedCards[0].front_text).not.toBe('New Front')

    updateCard(initialCards[0].id, 'front_text', 'New Front')

    expect(editedCards[0].front_text).toBe('New Front')
  })

  test('Adds card id to dirtyMap if value changed', () => {
    const initialCards = CardBuilder().many(3)
    const { dirtyMap, updateCard } = useEditableCards(initialCards)

    expect(dirtyMap.size).toBe(0)

    updateCard(initialCards[0].id, 'front_text', 'New Front')

    expect(dirtyMap.size).toBe(1)
    expect(dirtyMap.has(initialCards[0].id)).toBe(true)
  })

  test('Does NOT add to dirtyMap if value is the same as initial value', () => {
    const initialCards = CardBuilder().many(3)
    const { dirtyMap, updateCard } = useEditableCards(initialCards)

    expect(dirtyMap.size).toBe(0)

    updateCard(initialCards[0].id, 'front_text', initialCards[0].front_text)

    expect(dirtyMap.size).toBe(0)
  })

  test('Does nothing if card id not found', () => {
    const initialCards = CardBuilder().many(3)
    const { dirtyMap, updateCard } = useEditableCards(initialCards)

    expect(dirtyMap.size).toBe(0)

    updateCard(-1, 'front_text', 'New Front')

    expect(dirtyMap.size).toBe(0)
  })
})

describe('getChangedCards', () => {
  test('Returns only cards that have been changed (in dirtyMap)', () => {
    const initialCards = CardBuilder().many(3)
    const { updateCard, getChangedCards } = useEditableCards(initialCards)

    updateCard(initialCards[0].id, 'front_text', 'New Front')
    updateCard(initialCards[1].id, 'back_text', 'New Back')

    const changed = getChangedCards()
    expect(changed).toHaveLength(2)
  })

  test('Includes new cards in the changed list', () => {
    const initialCards = CardBuilder().many(3)
    const { addCard, getChangedCards } = useEditableCards(initialCards)

    addCard()

    const changed = getChangedCards()
    expect(changed).toHaveLength(1)
  })
})

describe('resetChanges', () => {
  test('Resets all fields in editedCards to match initialCards', () => {
    const initialCards = CardBuilder().many(3)
    const { updateCard, resetChanges, editedCards } = useEditableCards(initialCards)

    updateCard(initialCards[0].id, 'front_text', 'New Front')
    updateCard(initialCards[1].id, 'back_text', 'New Back')

    resetChanges()

    expect(editedCards).toEqual(initialCards)
  })

  test('Clears dirtyMap', () => {
    const initialCards = CardBuilder().many(3)
    const { dirtyMap, updateCard, resetChanges } = useEditableCards(initialCards)

    updateCard(initialCards[0].id, 'front_text', 'New Front')
    updateCard(initialCards[1].id, 'back_text', 'New Back')

    expect(dirtyMap.size).toBe(2)

    resetChanges()

    expect(dirtyMap.size).toBe(0)
  })

  test('isDirty is false after reset', () => {
    const initialCards = CardBuilder().many(3)
    const { isDirty, updateCard, resetChanges } = useEditableCards(initialCards)

    updateCard(initialCards[0].id, 'front_text', 'New Front')
    updateCard(initialCards[1].id, 'back_text', 'New Back')

    expect(isDirty.value).toBe(true)

    resetChanges()

    expect(isDirty.value).toBe(false)
  })
})

describe('isDirty (computed)', () => {
  test('Returns true if dirtyMap has at least one id', () => {
    const initialCards = CardBuilder().many(3)
    const { isDirty, updateCard } = useEditableCards(initialCards)

    updateCard(initialCards[0].id, 'front_text', 'New Front')

    expect(isDirty.value).toBe(true)
  })

  test('Returns false otherwise', () => {
    const initialCards = CardBuilder().many(3)
    const { isDirty } = useEditableCards(initialCards)

    expect(isDirty.value).toBe(false)
  })
})

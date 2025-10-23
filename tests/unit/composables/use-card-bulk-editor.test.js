import { expect, test, describe, vi, beforeEach } from 'vitest'
import { useCardBulkEditor } from '@/composables/use-card-bulk-editor'
import { card } from '@tests/mocks/models/card'

vi.mock('@/api/cards', () => ({
  updateCards: vi.fn(),
  deleteCardsById: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Initialization', () => {
  test('Initializes edited_cards with copies of initialCards', () => {
    const initialCards = card.many(3)
    const { edited_cards } = useCardBulkEditor(initialCards)

    expect(edited_cards.value).toHaveLength(3)
    expect(edited_cards.value[0]).not.toBe(initialCards[0])
    expect(edited_cards.value[0]).toEqual(initialCards[0])
  })

  test('is_dirty is false initially', () => {
    const initialCards = card.many(3)
    const { is_dirty } = useCardBulkEditor(initialCards)
    expect(is_dirty.value).toBe(false)
  })
})

describe('addCard', () => {
  test('Adds a new card with empty front_text/back_text at start of edited_cards', () => {
    const initialCards = card.many(3)
    const { edited_cards, addCard } = useCardBulkEditor(initialCards)
    const max = Math.max(...edited_cards.value.map((card) => card.order ?? 0)) + 1

    addCard()

    expect(edited_cards.value[0]).toEqual({
      front_text: '',
      back_text: '',
      order: max,
      new: true
    })
  })

  test('New card includes deck_id if provided', () => {
    const initialCards = card.many(3)
    const { edited_cards, addCard } = useCardBulkEditor(initialCards, 1)

    addCard()

    expect(edited_cards.value[0].deck_id).toBe(1)
  })

  test('When initialCards is empty, first added card gets order = 1', () => {
    const { edited_cards, addCard } = useCardBulkEditor([])

    addCard()

    expect(edited_cards.value[0].order).toBe(1)
  })
})

describe('updateCard', () => {
  test('Updates matching card by index with new value', () => {
    const initialCards = card.many(3)
    const { edited_cards, updateCard } = useCardBulkEditor(initialCards)

    expect(edited_cards.value[0].front_text).not.toBe('New Front')

    updateCard(0, 'front_text', 'New Front')

    expect(edited_cards.value[0].front_text).toBe('New Front')
  })

  test('Marks card as dirty if value changed', () => {
    const initialCards = card.many(3)
    const { edited_cards, updateCard, is_dirty } = useCardBulkEditor(initialCards)

    expect(is_dirty.value).toBe(false)

    updateCard(0, 'front_text', 'New Front')

    expect(is_dirty.value).toBe(true)
    expect(edited_cards.value[0].dirty).toBe(true)
  })

  test('Does NOT mark as dirty if value is the same', () => {
    const initialCards = card.many(3)
    const { edited_cards, updateCard, is_dirty } = useCardBulkEditor(initialCards)

    expect(is_dirty.value).toBe(false)

    updateCard(0, 'front_text', initialCards[0].front_text)

    expect(is_dirty.value).toBe(false)
    expect(edited_cards.value[0].dirty).toBeFalsy()
  })

  test('Does nothing if card index not found', () => {
    const initialCards = card.many(3)
    const { edited_cards, updateCard, is_dirty } = useCardBulkEditor(initialCards)

    expect(is_dirty.value).toBe(false)

    updateCard(99, 'front_text', 'New Front')

    expect(is_dirty.value).toBe(false)
    expect(edited_cards.value[0].front_text).not.toBe('New Front')
  })
})

describe('getChangedCards', () => {
  test('Returns only cards that have been changed (dirty or new)', () => {
    const initialCards = card.many(3)
    const { updateCard, getChangedCards } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'New Front')
    updateCard(1, 'back_text', 'New Back')

    const changed = getChangedCards()
    expect(changed).toHaveLength(2)
  })

  test('Includes new cards in the changed list', () => {
    const initialCards = card.many(3)
    const { addCard, getChangedCards } = useCardBulkEditor(initialCards)

    addCard()

    const changed = getChangedCards()
    expect(changed).toHaveLength(1)
  })
})

describe('resetCards', () => {
  test('Resets all fields in edited_cards to match initialCards', () => {
    const initialCards = card.many(3)
    const { updateCard, resetCards, edited_cards } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'New Front')
    updateCard(1, 'back_text', 'New Back')

    resetCards()

    expect(edited_cards.value).toEqual(initialCards)
  })

  test('is_dirty is false after reset', () => {
    const initialCards = card.many(3)
    const { is_dirty, updateCard, resetCards } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'New Front')
    updateCard(1, 'back_text', 'New Back')

    expect(is_dirty.value).toBe(true)

    resetCards()

    expect(is_dirty.value).toBe(false)
  })
})

describe('is_dirty (computed)', () => {
  test('Returns true if any card is dirty', () => {
    const initialCards = card.many(3)
    const { is_dirty, updateCard } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'New Front')

    expect(is_dirty.value).toBe(true)
  })

  test('Returns false otherwise', () => {
    const initialCards = card.many(3)
    const { is_dirty } = useCardBulkEditor(initialCards)

    expect(is_dirty.value).toBe(false)
  })
})

describe('Card Selection', () => {
  test('selectCard adds card index to selected_card_indices', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectCard } = useCardBulkEditor(initialCards)

    expect(selected_card_indices.value).toHaveLength(0)

    selectCard(1)

    expect(selected_card_indices.value).toEqual([1])
  })

  test('selectAllCards selects all card indices', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectAllCards } = useCardBulkEditor(initialCards)

    selectAllCards()

    expect(selected_card_indices.value).toEqual([0, 1, 2])
  })

  test('clearSelectedCards empties selected_card_indices', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectCard, clearSelectedCards } =
      useCardBulkEditor(initialCards)

    selectCard(0)
    selectCard(1)
    expect(selected_card_indices.value).toHaveLength(2)

    clearSelectedCards()

    expect(selected_card_indices.value).toHaveLength(0)
  })

  test('deselectCard removes card index from selected_card_indices', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectCard, deselectCard } = useCardBulkEditor(initialCards)

    selectCard(0)
    selectCard(1)
    selectCard(2)
    expect(selected_card_indices.value).toEqual([0, 1, 2])

    deselectCard(1)

    expect(selected_card_indices.value).toEqual([0, 2])
  })

  test('deselectCard does nothing if index not found', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectCard, deselectCard } = useCardBulkEditor(initialCards)

    selectCard(0)
    expect(selected_card_indices.value).toEqual([0])

    deselectCard(5)

    expect(selected_card_indices.value).toEqual([0])
  })

  test('toggleSelectCard selects card if not selected', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, toggleSelectCard } = useCardBulkEditor(initialCards)

    toggleSelectCard(1)

    expect(selected_card_indices.value).toEqual([1])
  })

  test('toggleSelectCard deselects card if already selected', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectCard, toggleSelectCard } = useCardBulkEditor(initialCards)

    selectCard(1)
    expect(selected_card_indices.value).toEqual([1])

    toggleSelectCard(1)

    expect(selected_card_indices.value).toEqual([])
  })

  test('toggleSelectAll selects all cards when none selected', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, toggleSelectAll } = useCardBulkEditor(initialCards)

    toggleSelectAll()

    expect(selected_card_indices.value).toEqual([0, 1, 2])
  })

  test('toggleSelectAll clears selection when all cards selected', () => {
    const initialCards = card.many(3)
    const { selected_card_indices, selectAllCards, toggleSelectAll } =
      useCardBulkEditor(initialCards)

    selectAllCards()
    expect(selected_card_indices.value).toEqual([0, 1, 2])

    toggleSelectAll()

    expect(selected_card_indices.value).toEqual([])
  })
})

describe('all_cards_selected computed', () => {
  test('Returns true when all cards are selected', () => {
    const initialCards = card.many(3)
    const { all_cards_selected, selectAllCards } = useCardBulkEditor(initialCards)

    selectAllCards()

    expect(all_cards_selected.value).toBe(true)
  })

  test('Returns false when not all cards are selected', () => {
    const initialCards = card.many(3)
    const { all_cards_selected, selectCard } = useCardBulkEditor(initialCards)

    selectCard(0)

    expect(all_cards_selected.value).toBe(false)
  })

  test('Returns false when no cards are selected', () => {
    const initialCards = card.many(3)
    const { all_cards_selected } = useCardBulkEditor(initialCards)

    expect(all_cards_selected.value).toBe(false)
  })
})

describe('Card Activation', () => {
  test('activateCard sets active_card_index', () => {
    const initialCards = card.many(3)
    const { active_card_index, activateCard } = useCardBulkEditor(initialCards)

    expect(active_card_index.value).toBeUndefined()

    activateCard(1)

    expect(active_card_index.value).toBe(1)
  })

  test('deactivateCard clears active_card_index when matching', () => {
    const initialCards = card.many(3)
    const { active_card_index, activateCard, deactivateCard } = useCardBulkEditor(initialCards)

    activateCard(1)
    expect(active_card_index.value).toBe(1)

    deactivateCard(1)

    expect(active_card_index.value).toBeUndefined()
  })

  test('deactivateCard does nothing when index does not match', () => {
    const initialCards = card.many(3)
    const { active_card_index, activateCard, deactivateCard } = useCardBulkEditor(initialCards)

    activateCard(1)
    expect(active_card_index.value).toBe(1)

    deactivateCard(2)

    expect(active_card_index.value).toBe(1)
  })

  test('deactivateCard without parameter does not clear active_card_index', () => {
    const initialCards = card.many(3)
    const { active_card_index, activateCard, deactivateCard } = useCardBulkEditor(initialCards)

    activateCard(1)
    expect(active_card_index.value).toBe(1)

    deactivateCard()

    // Should not clear because no index was provided to match
    expect(active_card_index.value).toBe(1)
  })
})

describe('Mode Management', () => {
  test('setMode changes mode', async () => {
    const initialCards = card.many(3)
    const { mode, setMode } = useCardBulkEditor(initialCards)

    expect(mode.value).toBe('view')

    await setMode('edit')

    expect(mode.value).toBe('edit')
  })

  test('setMode with reset=false does not reset edits', async () => {
    const initialCards = card.many(3)
    const { mode, setMode, updateCard, is_dirty } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'Changed')
    expect(is_dirty.value).toBe(true)

    await setMode('edit', false)

    expect(mode.value).toBe('edit')
    expect(is_dirty.value).toBe(true)
  })
})

describe('resetEdits', () => {
  test('Resets cards, clears selection, and deactivates card', () => {
    const initialCards = card.many(3)
    const {
      updateCard,
      selectCard,
      activateCard,
      resetEdits,
      edited_cards,
      selected_card_indices,
      active_card_index,
      is_dirty
    } = useCardBulkEditor(initialCards)

    // Make changes
    updateCard(0, 'front_text', 'Changed')
    selectCard(1)
    activateCard(2)

    expect(is_dirty.value).toBe(true)
    expect(selected_card_indices.value).toEqual([1])
    expect(active_card_index.value).toBe(2)

    resetEdits()

    expect(edited_cards.value).toEqual(initialCards)
    expect(selected_card_indices.value).toEqual([])
    expect(active_card_index.value).toBeUndefined()
    expect(is_dirty.value).toBe(false)
  })
})

describe('saveCards', () => {
  test('Calls updateCards with changed cards', async () => {
    const { updateCards } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { updateCard, saveCards } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'Changed')

    await saveCards()

    expect(updateCards).toHaveBeenCalledWith([
      expect.objectContaining({
        ...initialCards[0],
        front_text: 'Changed'
      })
    ])
  })

  test('Does nothing when no cards changed', async () => {
    const { updateCards } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { saveCards } = useCardBulkEditor(initialCards)

    await saveCards()

    expect(updateCards).not.toHaveBeenCalled()
  })

  test('Handles errors gracefully', async () => {
    const { updateCards } = await import('@/api/cards')
    updateCards.mockRejectedValueOnce(new Error('Save failed'))

    const initialCards = card.many(3)
    const { updateCard, saveCards } = useCardBulkEditor(initialCards)

    updateCard(0, 'front_text', 'Changed')

    // Should not throw
    await expect(saveCards()).resolves.toBeUndefined()
  })
})

describe('deleteCards', () => {
  test('Calls deleteCardsById with selected card IDs', async () => {
    const { deleteCardsById } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { selectCard, deleteCards } = useCardBulkEditor(initialCards)

    selectCard(0)
    selectCard(2)

    await deleteCards()

    expect(deleteCardsById).toHaveBeenCalledWith([initialCards[0].id, initialCards[2].id])
  })

  test('Clears selection after deletion', async () => {
    const initialCards = card.many(3)
    const { selectCard, deleteCards, selected_card_indices } = useCardBulkEditor(initialCards)

    selectCard(0)
    selectCard(1)
    expect(selected_card_indices.value).toEqual([0, 1])

    await deleteCards()

    expect(selected_card_indices.value).toEqual([])
  })

  test('Does nothing when no cards selected', async () => {
    const { deleteCardsById } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { deleteCards } = useCardBulkEditor(initialCards)

    await deleteCards()

    expect(deleteCardsById).not.toHaveBeenCalled()
  })

  test('Filters out cards without IDs', async () => {
    const { deleteCardsById } = await import('@/api/cards')
    const initialCards = card.many(2)
    const { selectCard, addCard, deleteCards, selected_card_indices } =
      useCardBulkEditor(initialCards)

    addCard() // New card without ID
    selectCard(0) // New card (index 0)
    selectCard(1) // Original card (index 1)
    selectCard(2) // Original card (index 2)

    await deleteCards()

    // Should only delete cards with IDs
    expect(deleteCardsById).toHaveBeenCalledWith([initialCards[0].id, initialCards[1].id])
    expect(selected_card_indices.value).toEqual([])
  })

  test('Handles errors gracefully', async () => {
    const { deleteCardsById } = await import('@/api/cards')
    deleteCardsById.mockRejectedValueOnce(new Error('Delete failed'))

    const initialCards = card.many(3)
    const { selectCard, deleteCards, selected_card_indices } = useCardBulkEditor(initialCards)

    selectCard(0)

    // Should not throw and should still clear selection
    await expect(deleteCards()).resolves.toBeUndefined()
    expect(selected_card_indices.value).toEqual([])
  })
})

describe('resetCards with parameters', () => {
  test('Resets with new cards and deck_id', () => {
    const initialCards = card.many(3)
    const newCards = card.many(2)
    const { edited_cards, resetCards } = useCardBulkEditor(initialCards, 1)

    resetCards(newCards, 2)

    expect(edited_cards.value).toEqual(newCards)
  })

  test('Resets with new cards only', () => {
    const initialCards = card.many(3)
    const newCards = card.many(2)
    const { edited_cards, resetCards } = useCardBulkEditor(initialCards)

    resetCards(newCards)

    expect(edited_cards.value).toEqual(newCards)
  })
})

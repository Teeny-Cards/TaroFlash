import { expect, test, describe, vi, beforeEach } from 'vite-plus/test'
import { useCardBulkEditor } from '@/composables/card-bulk-editor'
import { card } from '@tests/mocks/models/card'

vi.mock('@/api/cards', () => ({
  deleteCards: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Card Selection', () => {
  test('selectCard adds card id to selected_card_ids', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectCard } = useCardBulkEditor(initialCards)

    expect(selected_card_ids.value).toHaveLength(0)

    selectCard(initialCards[1].id)

    expect(selected_card_ids.value).toEqual([initialCards[1].id])
  })

  test('selectAllCards selects all card ids', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectAllCards } = useCardBulkEditor(initialCards)

    selectAllCards()

    expect(selected_card_ids.value).toEqual(initialCards.map((card) => card.id))
  })

  test('clearSelectedCards empties selected_card_ids', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectCard, clearSelectedCards } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)
    selectCard(initialCards[1].id)
    expect(selected_card_ids.value).toHaveLength(2)

    clearSelectedCards()

    expect(selected_card_ids.value).toHaveLength(0)
  })

  test('deselectCard removes card id from selected_card_ids', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectCard, deselectCard } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)
    selectCard(initialCards[1].id)
    selectCard(initialCards[2].id)
    expect(selected_card_ids.value).toEqual([
      initialCards[0].id,
      initialCards[1].id,
      initialCards[2].id
    ])

    deselectCard(initialCards[1].id)

    expect(selected_card_ids.value).toEqual([initialCards[0].id, initialCards[2].id])
  })

  test('deselectCard does nothing if id not found', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectCard, deselectCard } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)
    expect(selected_card_ids.value).toEqual([initialCards[0].id])

    deselectCard(5)

    expect(selected_card_ids.value).toEqual([initialCards[0].id])
  })

  test('toggleSelectCard selects card if not selected', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, toggleSelectCard } = useCardBulkEditor(initialCards)

    toggleSelectCard(initialCards[1].id)

    expect(selected_card_ids.value).toEqual([initialCards[1].id])
  })

  test('toggleSelectCard deselects card if already selected', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectCard, toggleSelectCard } = useCardBulkEditor(initialCards)

    selectCard(initialCards[1].id)
    expect(selected_card_ids.value).toEqual([initialCards[1].id])

    toggleSelectCard(initialCards[1].id)

    expect(selected_card_ids.value).toEqual([])
  })

  test('toggleSelectAll selects all cards when none selected', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, toggleSelectAll } = useCardBulkEditor(initialCards)

    toggleSelectAll()

    expect(selected_card_ids.value).toEqual(initialCards.map((card) => card.id))
  })

  test('toggleSelectAll clears selection when all cards selected', () => {
    const initialCards = card.many(3)
    const { selected_card_ids, selectAllCards, toggleSelectAll } = useCardBulkEditor(initialCards)

    selectAllCards()
    expect(selected_card_ids.value).toEqual(initialCards.map((card) => card.id))

    toggleSelectAll()

    expect(selected_card_ids.value).toEqual([])
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

    selectCard(initialCards[0].id)

    expect(all_cards_selected.value).toBe(false)
  })

  test('Returns false when no cards are selected', () => {
    const initialCards = card.many(3)
    const { all_cards_selected } = useCardBulkEditor(initialCards)

    expect(all_cards_selected.value).toBe(false)
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
})

describe('deleteCards', () => {
  test('Calls deleteCards API with selected cards', async () => {
    const { deleteCards: deleteCardsApi } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { selectCard, deleteCards } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)
    selectCard(initialCards[2].id)

    await deleteCards()

    expect(deleteCardsApi).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: initialCards[0].id }),
        expect.objectContaining({ id: initialCards[2].id })
      ])
    )
  })

  test('Clears selection after deletion', async () => {
    const initialCards = card.many(3)
    const { selectCard, deleteCards, selected_card_ids } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)
    selectCard(initialCards[1].id)
    expect(selected_card_ids.value).toEqual([initialCards[0].id, initialCards[1].id])

    await deleteCards()

    expect(selected_card_ids.value).toEqual([])
  })

  test('Does nothing when no cards selected', async () => {
    const { deleteCards: deleteCardsApi } = await import('@/api/cards')
    const initialCards = card.many(3)
    const { deleteCards } = useCardBulkEditor(initialCards)

    await deleteCards()

    expect(deleteCardsApi).not.toHaveBeenCalled()
  })

  test('Handles errors gracefully', async () => {
    const { deleteCards: deleteCardsApi } = await import('@/api/cards')
    deleteCardsApi.mockRejectedValueOnce(new Error('Delete failed'))

    const initialCards = card.many(3)
    const { selectCard, deleteCards, selected_card_ids } = useCardBulkEditor(initialCards)

    selectCard(initialCards[0].id)

    // Should not throw and should still clear selection
    await expect(deleteCards()).resolves.toBeUndefined()
    expect(selected_card_ids.value).toEqual([])
  })
})

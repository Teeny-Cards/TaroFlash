import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { card } from '@tests/fixtures/card'

const { insertCardAtMock, saveCardMock, deleteCardsMock, deleteCardsInDeckMock } = vi.hoisted(
  () => ({
    insertCardAtMock: vi.fn(),
    saveCardMock: vi.fn(),
    deleteCardsMock: vi.fn(),
    deleteCardsInDeckMock: vi.fn()
  })
)

vi.mock('@/api/cards', () => ({
  useCardsInDeckInfiniteQuery: vi.fn(),
  useDeckCardIdsQuery: vi.fn(),
  useInsertCardAtMutation: () => ({ mutate: insertCardAtMock, mutateAsync: insertCardAtMock }),
  useSaveCardMutation: () => ({ mutate: saveCardMock, mutateAsync: saveCardMock }),
  useDeleteCardsMutation: () => ({ mutate: deleteCardsMock, mutateAsync: deleteCardsMock }),
  useDeleteCardsInDeckMutation: () => ({
    mutate: deleteCardsInDeckMock,
    mutateAsync: deleteCardsInDeckMock
  })
}))

import { useCardBulkEditor } from '@/composables/card-bulk-editor'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

// Lightweight stand-ins for the colada query return shapes the composable
// reads from. Use plain object refs so tests can mutate `.value` directly.
function makeCardsQuery(persisted = []) {
  return {
    data: { value: { pages: [persisted], pageParams: [0] } },
    hasNextPage: { value: false },
    loadNextPage: vi.fn(),
    isLoading: { value: false }
  }
}

function makeIdsQuery(ids = []) {
  return {
    data: { value: ids }
  }
}

function makeEditor(persisted = [], ids = persisted.map((c) => c.id)) {
  return useCardBulkEditor(makeCardsQuery(persisted), makeIdsQuery(ids), 10)
}

describe('useCardBulkEditor', () => {
  beforeEach(() => {
    insertCardAtMock.mockReset()
    insertCardAtMock.mockResolvedValue({ id: 9999, rank: 1500 })
    saveCardMock.mockReset()
    saveCardMock.mockResolvedValue(undefined)
    deleteCardsMock.mockReset()
    deleteCardsMock.mockResolvedValue(undefined)
    deleteCardsInDeckMock.mockReset()
    deleteCardsInDeckMock.mockResolvedValue(0)
  })

  // ── Initialization ─────────────────────────────────────────────────────────

  describe('initialization', () => {
    test('all_cards reflects the persisted query pages', () => {
      const { all_cards } = makeEditor([makeCard({ id: 1 }), makeCard({ id: 2 })])
      expect(all_cards.value.map((c) => c.id)).toEqual([1, 2])
    })

    test('starts in view mode with no selection and not in select-all mode', () => {
      const { mode, selected_card_ids, deselected_ids, select_all_mode, saving } = makeEditor()
      expect(mode.value).toBe('view')
      expect(selected_card_ids.value).toEqual([])
      expect(deselected_ids.value).toEqual([])
      expect(select_all_mode.value).toBe(false)
      expect(saving.value).toBe(false)
    })
  })

  // ── addCard ────────────────────────────────────────────────────────────────

  describe('addCard', () => {
    test('appends a temp card with anchor=null when the deck is empty', () => {
      const { all_cards, addCard } = makeEditor()
      addCard()
      expect(all_cards.value).toHaveLength(1)
      expect(all_cards.value[0].id).toBeLessThan(0)
    })

    test('uses the last persisted card as anchor (side=after) when no neighbors are passed', async () => {
      const { addCard, updateCard, all_cards } = makeEditor([
        makeCard({ id: 100 }),
        makeCard({ id: 200 })
      ])
      addCard()
      const temp_id = all_cards.value.at(-1).id
      await updateCard(temp_id, { front_text: 'X' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.anchor_id).toBe(200)
      expect(args.side).toBe('after')
    })

    test('uses the explicit left neighbor as anchor (side=after) when given', async () => {
      const { addCard, updateCard, all_cards } = makeEditor([
        makeCard({ id: 100 }),
        makeCard({ id: 200 })
      ])
      addCard(100)
      const temp_id = all_cards.value.find((c) => c.id < 0).id
      await updateCard(temp_id, { front_text: 'X' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.anchor_id).toBe(100)
      expect(args.side).toBe('after')
    })

    test('uses the right neighbor as anchor (side=before) when only right is given', async () => {
      const { addCard, updateCard, all_cards } = makeEditor([makeCard({ id: 200 })])
      addCard(undefined, 200)
      const temp_id = all_cards.value.find((c) => c.id < 0).id
      await updateCard(temp_id, { front_text: 'X' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.anchor_id).toBe(200)
      expect(args.side).toBe('before')
    })

    test('positions a temp card after its left anchor in the merged list', () => {
      const { all_cards, addCard } = makeEditor([makeCard({ id: 100 }), makeCard({ id: 200 })])
      addCard(100)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
      expect(all_cards.value[1].id).toBeLessThan(0)
    })

    test('positions a temp card before its right anchor in the merged list', () => {
      const { all_cards, addCard } = makeEditor([makeCard({ id: 200 })])
      addCard(undefined, 200)
      expect(all_cards.value.map((c) => c.id)).toEqual([all_cards.value[0].id, 200])
      expect(all_cards.value[0].id).toBeLessThan(0)
    })

    test('initializes new temp cards with empty front/back text', () => {
      const { addCard, all_cards } = makeEditor()
      addCard()
      expect(all_cards.value[0].front_text).toBe('')
      expect(all_cards.value[0].back_text).toBe('')
    })

    test('successive temp adds get unique negative ids', () => {
      const { addCard, all_cards } = makeEditor()
      addCard()
      addCard()
      const ids = all_cards.value.map((c) => c.id)
      expect(ids[0]).not.toBe(ids[1])
    })
  })

  // ── appendCard / prependCard ───────────────────────────────────────────────

  describe('appendCard / prependCard', () => {
    test('appendCard delegates to addCard with the target as left neighbor', () => {
      const { all_cards, appendCard } = makeEditor([makeCard({ id: 100 }), makeCard({ id: 200 })])
      appendCard(100)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
    })

    test('prependCard delegates to addCard with the target as right neighbor', () => {
      const { all_cards, prependCard } = makeEditor([makeCard({ id: 100 }), makeCard({ id: 200 })])
      prependCard(200)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
    })
  })

  // ── updateCard — routing between insertCardAt (temp) and saveCard (real) ───

  describe('updateCard', () => {
    test('routes to saveCard for an existing (real-id) card', async () => {
      const real = makeCard({ id: 42 })
      const { updateCard } = makeEditor([real])
      await updateCard(42, { front_text: 'Updated' })
      expect(saveCardMock).toHaveBeenCalledOnce()
      expect(insertCardAtMock).not.toHaveBeenCalled()
    })

    test('routes to insertCardAt on first save of a temp card', async () => {
      const { addCard, all_cards, updateCard } = makeEditor()
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'Q', back_text: 'A' })
      expect(insertCardAtMock).toHaveBeenCalledOnce()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('removes the temp card after a successful insert (cache refetch supplies the real one)', async () => {
      const { addCard, all_cards, updateCard } = makeEditor()
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'X' })
      expect(all_cards.value.find((c) => c.id === temp_id)).toBeUndefined()
    })

    test('passes front/back text to insertCardAt, preferring values over temp state', async () => {
      const { addCard, all_cards, updateCard } = makeEditor()
      addCard()
      await updateCard(all_cards.value[0].id, { front_text: 'from values' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.front_text).toBe('from values')
      expect(args.back_text).toBe('')
    })

    test('is a no-op when the id is not found', async () => {
      const { updateCard } = makeEditor()
      await updateCard(999, { front_text: 'X' })
      expect(insertCardAtMock).not.toHaveBeenCalled()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('toggles saving around the async work', async () => {
      let resolveSave
      saveCardMock.mockReturnValueOnce(new Promise((r) => (resolveSave = r)))
      const { updateCard, saving } = makeEditor([makeCard({ id: 1 })])
      const promise = updateCard(1, { front_text: 'X' })
      expect(saving.value).toBe(true)
      resolveSave()
      await promise
      expect(saving.value).toBe(false)
    })

    test('resets saving even if saveCard rejects', async () => {
      saveCardMock.mockRejectedValueOnce(new Error('boom'))
      const { updateCard, saving } = makeEditor([makeCard({ id: 1 })])
      await expect(updateCard(1, { front_text: 'X' })).rejects.toThrow('boom')
      expect(saving.value).toBe(false)
    })
  })

  // ── selection — positive mode ──────────────────────────────────────────────

  describe('selection — positive mode', () => {
    test('selectCard adds an id once (no duplicates)', () => {
      const { selectCard, selected_card_ids } = makeEditor()
      selectCard(1)
      selectCard(1)
      expect(selected_card_ids.value).toEqual([1])
    })

    test('deselectCard removes an id', () => {
      const { selectCard, deselectCard, selected_card_ids } = makeEditor()
      selectCard(1)
      selectCard(2)
      deselectCard(1)
      expect(selected_card_ids.value).toEqual([2])
    })

    test('toggleSelectCard flips selection state', () => {
      const { toggleSelectCard, selected_card_ids } = makeEditor()
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([1])
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([])
    })

    test('isCardSelected reflects the positive selection set', () => {
      const { selectCard, isCardSelected } = makeEditor()
      selectCard(1)
      expect(isCardSelected(1)).toBe(true)
      expect(isCardSelected(2)).toBe(false)
    })

    test('selected_count tracks the positive selection length', () => {
      const { selectCard, selected_count } = makeEditor()
      selectCard(1)
      selectCard(2)
      expect(selected_count.value).toBe(2)
    })

    test('all_cards_selected is true when the positive selection equals the deck total', () => {
      const { selectCard, all_cards_selected } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      expect(all_cards_selected.value).toBe(false)
      selectCard(1)
      selectCard(2)
      expect(all_cards_selected.value).toBe(true)
    })
  })

  // ── selection — select-all mode (A2) ───────────────────────────────────────

  describe('selection — select-all mode', () => {
    test('selectAllCards flips into select-all mode and clears the positive list', () => {
      const { selectCard, selectAllCards, selected_card_ids, select_all_mode } = makeEditor()
      selectCard(1)
      selectAllCards()
      expect(select_all_mode.value).toBe(true)
      expect(selected_card_ids.value).toEqual([])
    })

    test('isCardSelected returns true for everything except deselected ids in select-all mode', () => {
      const { selectAllCards, deselectCard, isCardSelected } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      selectAllCards()
      deselectCard(1)
      expect(isCardSelected(1)).toBe(false)
      expect(isCardSelected(2)).toBe(true)
    })

    test('selected_count = total - deselected in select-all mode', () => {
      const { selectAllCards, deselectCard, selected_count } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })],
        [1, 2, 3]
      )
      selectAllCards()
      expect(selected_count.value).toBe(3)
      deselectCard(2)
      expect(selected_count.value).toBe(2)
    })

    test('selectCard in select-all mode removes the id from the deselected list', () => {
      const { selectAllCards, deselectCard, selectCard, deselected_ids } = makeEditor(
        [makeCard({ id: 1 })],
        [1]
      )
      selectAllCards()
      deselectCard(1)
      expect(deselected_ids.value).toEqual([1])
      selectCard(1)
      expect(deselected_ids.value).toEqual([])
    })

    test('clearSelectedCards exits select-all mode and empties both lists', () => {
      const { selectAllCards, deselectCard, clearSelectedCards, select_all_mode, deselected_ids } =
        makeEditor([makeCard({ id: 1 })], [1])
      selectAllCards()
      deselectCard(1)
      clearSelectedCards()
      expect(select_all_mode.value).toBe(false)
      expect(deselected_ids.value).toEqual([])
    })

    test('toggleSelectAll selects everything when nothing is selected', () => {
      const { toggleSelectAll, select_all_mode } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      toggleSelectAll()
      expect(select_all_mode.value).toBe(true)
    })

    test('toggleSelectAll clears the selection when everything is selected', () => {
      const { toggleSelectAll, select_all_mode, all_cards_selected } = makeEditor(
        [makeCard({ id: 1 })],
        [1]
      )
      toggleSelectAll()
      expect(all_cards_selected.value).toBe(true)
      toggleSelectAll()
      expect(select_all_mode.value).toBe(false)
    })

    test('all_cards_selected is true in select-all mode iff nothing has been deselected', () => {
      const { selectAllCards, deselectCard, all_cards_selected } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      selectAllCards()
      expect(all_cards_selected.value).toBe(true)
      deselectCard(1)
      expect(all_cards_selected.value).toBe(false)
    })
  })

  // ── getSelectedCards ───────────────────────────────────────────────────────

  describe('getSelectedCards', () => {
    test('returns selected cards with review stripped by default', () => {
      const initial = [makeCard({ id: 1, review: { due: new Date() } }), makeCard({ id: 2 })]
      const { selectCard, getSelectedCards } = makeEditor(initial, [1, 2])
      selectCard(1)
      const [c] = getSelectedCards()
      expect('review' in c).toBe(false)
    })

    test('preserves review when clean=false', () => {
      const initial = [makeCard({ id: 1, review: { due: new Date() } })]
      const { selectCard, getSelectedCards } = makeEditor(initial, [1])
      selectCard(1)
      const [c] = getSelectedCards(false)
      expect('review' in c).toBe(true)
    })

    test('returns only LOADED selected cards in select-all mode (unloaded ids are unrecoverable client-side)', () => {
      const initial = [makeCard({ id: 1 })]
      const ids = [1, 2, 3] // ids 2, 3 not in loaded pages
      const { selectAllCards, getSelectedCards } = makeEditor(initial, ids)
      selectAllCards()
      const cards = getSelectedCards()
      expect(cards).toHaveLength(1)
      expect(cards[0].id).toBe(1)
    })
  })

  // ── deleteCards ────────────────────────────────────────────────────────────

  describe('deleteCards', () => {
    test('uses deleteCards (positive selection) when select-all-mode is off', async () => {
      const { selectCard, deleteCards } = makeEditor([makeCard({ id: 1 })], [1])
      selectCard(1)
      await deleteCards()
      expect(deleteCardsMock).toHaveBeenCalledOnce()
      expect(deleteCardsInDeckMock).not.toHaveBeenCalled()
    })

    test('uses deleteCardsInDeck (deck-wide minus exceptions) in select-all mode', async () => {
      const { selectAllCards, deselectCard, deleteCards } = makeEditor(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      selectAllCards()
      deselectCard(1)
      await deleteCards()
      expect(deleteCardsInDeckMock).toHaveBeenCalledWith({ deck_id: 10, except_ids: [1] })
      expect(deleteCardsMock).not.toHaveBeenCalled()
    })

    test('clears selection after delete in either mode', async () => {
      const { selectCard, deleteCards, selected_card_ids } = makeEditor([makeCard({ id: 1 })], [1])
      selectCard(1)
      await deleteCards()
      expect(selected_card_ids.value).toEqual([])
    })

    test('clears select-all mode after deck-wide delete', async () => {
      const { selectAllCards, deleteCards, select_all_mode } = makeEditor(
        [makeCard({ id: 1 })],
        [1]
      )
      selectAllCards()
      await deleteCards()
      expect(select_all_mode.value).toBe(false)
    })

    test('is a no-op when nothing is selected', async () => {
      const { deleteCards } = makeEditor([makeCard({ id: 1 })], [1])
      await deleteCards()
      expect(deleteCardsMock).not.toHaveBeenCalled()
      expect(deleteCardsInDeckMock).not.toHaveBeenCalled()
    })

    test('still clears selection when the API rejects', async () => {
      deleteCardsMock.mockRejectedValueOnce(new Error('boom'))
      const { selectCard, deleteCards, selected_card_ids } = makeEditor([makeCard({ id: 1 })], [1])
      selectCard(1)
      await deleteCards()
      expect(selected_card_ids.value).toEqual([])
    })
  })

  // ── setMode ────────────────────────────────────────────────────────────────

  describe('setMode', () => {
    test('updates the mode ref', () => {
      const { mode, setMode } = makeEditor()
      setMode('edit')
      expect(mode.value).toBe('edit')
    })
  })
})

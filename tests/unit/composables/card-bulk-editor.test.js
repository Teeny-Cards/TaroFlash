import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { card } from '@tests/fixtures/card'

const { insertCardMock, saveCardMock, deleteCardsMock } = vi.hoisted(() => ({
  insertCardMock: vi.fn(),
  saveCardMock: vi.fn(),
  deleteCardsMock: vi.fn()
}))

vi.mock('@/api/cards', () => ({
  insertCard: insertCardMock,
  saveCard: saveCardMock,
  deleteCards: deleteCardsMock
}))

import { useCardBulkEditor } from '@/composables/card-bulk-editor'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

describe('useCardBulkEditor', () => {
  beforeEach(() => {
    insertCardMock.mockReset()
    insertCardMock.mockResolvedValue({ id: 9999, rank: 1500 })
    saveCardMock.mockReset()
    saveCardMock.mockResolvedValue(undefined)
    deleteCardsMock.mockReset()
    deleteCardsMock.mockResolvedValue(undefined)
  })

  // ── Initialization ─────────────────────────────────────────────────────────

  describe('initialization', () => {
    test('seeds all_cards from the initial array', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { all_cards } = useCardBulkEditor(initial, 10)
      expect(all_cards.value).toHaveLength(2)
      expect(all_cards.value.map((c) => c.id)).toEqual([1, 2])
    })

    test('does not mutate the caller-provided array', () => {
      const initial = [makeCard({ id: 1 })]
      const { addCard } = useCardBulkEditor(initial, 10)
      addCard()
      expect(initial).toHaveLength(1)
    })

    test('starts in view mode with no selection', () => {
      const { mode, selected_card_ids, saving } = useCardBulkEditor([], 10)
      expect(mode.value).toBe('view')
      expect(selected_card_ids.value).toEqual([])
      expect(saving.value).toBe(false)
    })
  })

  // ── addCard (in-memory only, no network) ───────────────────────────────────

  describe('addCard', () => {
    test('appends to the end by default and does not hit the network', () => {
      const { all_cards, addCard } = useCardBulkEditor([makeCard({ id: 1 })], 10)
      addCard()
      expect(all_cards.value).toHaveLength(2)
      expect(insertCardMock).not.toHaveBeenCalled()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('assigns a negative temp id so the card is distinguishable from persisted rows', () => {
      const { all_cards, addCard } = useCardBulkEditor([], 10)
      addCard()
      expect(all_cards.value[0].id).toBeLessThan(0)
    })

    test('assigns unique temp ids to successive adds', () => {
      const { all_cards, addCard } = useCardBulkEditor([], 10)
      addCard()
      addCard()
      expect(all_cards.value[0].id).not.toBe(all_cards.value[1].id)
    })

    test('inserts after the given left neighbor', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })]
      const { all_cards, addCard } = useCardBulkEditor(initial, 10)
      addCard(1) // insert after card 1
      expect(all_cards.value.map((c) => c.id)).toEqual([1, all_cards.value[1].id, 2, 3])
    })

    test('inserts before the given right neighbor when no left neighbor', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { all_cards, addCard } = useCardBulkEditor(initial, 10)
      addCard(undefined, 2) // insert before card 2
      expect(all_cards.value.map((c) => c.id)).toEqual([1, all_cards.value[1].id, 2])
    })

    test('appends when neither neighbor matches an existing card', () => {
      const initial = [makeCard({ id: 1 })]
      const { all_cards, addCard } = useCardBulkEditor(initial, 10)
      addCard(999, 888)
      expect(all_cards.value).toHaveLength(2)
      expect(all_cards.value[1].id).toBeLessThan(0)
    })

    test('initializes front/back text to empty strings', () => {
      const { all_cards, addCard } = useCardBulkEditor([], 10)
      addCard()
      expect(all_cards.value[0].front_text).toBe('')
      expect(all_cards.value[0].back_text).toBe('')
    })
  })

  // ── appendCard / prependCard ───────────────────────────────────────────────

  describe('appendCard / prependCard', () => {
    test('appendCard inserts after the target and before the next real card', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { all_cards, appendCard } = useCardBulkEditor(initial, 10)
      appendCard(1)
      expect(all_cards.value.map((c) => c.id)).toEqual([1, all_cards.value[1].id, 2])
    })

    test('prependCard inserts before the target and after the previous real card', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { all_cards, prependCard } = useCardBulkEditor(initial, 10)
      prependCard(2)
      expect(all_cards.value.map((c) => c.id)).toEqual([1, all_cards.value[1].id, 2])
    })
  })

  // ── updateCard — routing between insertCard (temp) and saveCard (real) ─────

  describe('updateCard', () => {
    test('routes to saveCard for an existing (real-id) card', async () => {
      const real = makeCard({ id: 42 })
      const { updateCard } = useCardBulkEditor([real], 10)
      await updateCard(42, { front_text: 'Updated' })
      expect(saveCardMock).toHaveBeenCalledOnce()
      expect(insertCardMock).not.toHaveBeenCalled()
    })

    test('routes to insertCard on first save of a temp card', async () => {
      const { addCard, all_cards, updateCard } = useCardBulkEditor([], 10)
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'Q', back_text: 'A' })
      expect(insertCardMock).toHaveBeenCalledOnce()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('swaps temp id for the real id returned by insertCard', async () => {
      insertCardMock.mockResolvedValueOnce({ id: 777, rank: 1234 })
      const { addCard, all_cards, updateCard } = useCardBulkEditor([], 10)
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'X' })
      expect(all_cards.value[0].id).toBe(777)
      expect(all_cards.value[0].rank).toBe(1234)
    })

    test('sends null neighbors when the temp card is the only card', async () => {
      const { addCard, all_cards, updateCard } = useCardBulkEditor([], 10)
      addCard()
      await updateCard(all_cards.value[0].id, { front_text: 'X' })
      const [args] = insertCardMock.mock.calls[0]
      expect(args.left_card_id).toBeNull()
      expect(args.right_card_id).toBeNull()
    })

    test('finds real neighbors on either side of a temp card', async () => {
      const initial = [makeCard({ id: 100 }), makeCard({ id: 200 })]
      const { addCard, all_cards, updateCard } = useCardBulkEditor(initial, 10)
      addCard(100, 200) // insert between 100 and 200
      const temp_id = all_cards.value[1].id
      await updateCard(temp_id, { front_text: 'X' })
      const [args] = insertCardMock.mock.calls[0]
      expect(args.left_card_id).toBe(100)
      expect(args.right_card_id).toBe(200)
    })

    test('skips adjacent temp cards when resolving neighbors', async () => {
      const initial = [makeCard({ id: 100 }), makeCard({ id: 200 })]
      const { addCard, all_cards, updateCard } = useCardBulkEditor(initial, 10)
      addCard(100) // temp A between 100 and 200
      addCard(all_cards.value[1].id) // temp B after temp A, before 200
      const temp_b_id = all_cards.value[2].id
      await updateCard(temp_b_id, { front_text: 'X' })
      const [args] = insertCardMock.mock.calls[0]
      // A (negative id) is skipped, so the left neighbor resolves to 100 (real).
      expect(args.left_card_id).toBe(100)
      expect(args.right_card_id).toBe(200)
    })

    test('passes front/back text to insertCard, preferring values over card state', async () => {
      const { addCard, all_cards, updateCard } = useCardBulkEditor([], 10)
      addCard()
      await updateCard(all_cards.value[0].id, { front_text: 'from values' })
      const [args] = insertCardMock.mock.calls[0]
      expect(args.front_text).toBe('from values')
      expect(args.back_text).toBe('')
    })

    test('is a no-op when the id is not found', async () => {
      const { updateCard } = useCardBulkEditor([], 10)
      await updateCard(999, { front_text: 'X' })
      expect(insertCardMock).not.toHaveBeenCalled()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('toggles saving around the async work', async () => {
      let resolveSave
      saveCardMock.mockReturnValueOnce(
        new Promise((r) => {
          resolveSave = r
        })
      )
      const { updateCard, saving } = useCardBulkEditor([makeCard({ id: 1 })], 10)
      const promise = updateCard(1, { front_text: 'X' })
      expect(saving.value).toBe(true)
      resolveSave()
      await promise
      expect(saving.value).toBe(false)
    })

    test('resets saving even if saveCard rejects', async () => {
      saveCardMock.mockRejectedValueOnce(new Error('boom'))
      const { updateCard, saving } = useCardBulkEditor([makeCard({ id: 1 })], 10)
      await expect(updateCard(1, { front_text: 'X' })).rejects.toThrow('boom')
      expect(saving.value).toBe(false)
    })
  })

  // ── selection ──────────────────────────────────────────────────────────────

  describe('selection', () => {
    test('selectCard adds an id once (no duplicates)', () => {
      const { selectCard, selected_card_ids } = useCardBulkEditor([], 10)
      selectCard(1)
      selectCard(1)
      expect(selected_card_ids.value).toEqual([1])
    })

    test('deselectCard removes an id', () => {
      const { selectCard, deselectCard, selected_card_ids } = useCardBulkEditor([], 10)
      selectCard(1)
      selectCard(2)
      deselectCard(1)
      expect(selected_card_ids.value).toEqual([2])
    })

    test('toggleSelectCard flips selection state', () => {
      const { toggleSelectCard, selected_card_ids } = useCardBulkEditor([], 10)
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([1])
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([])
    })

    test('selectAllCards selects every card with a defined id', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })]
      const { selectAllCards, selected_card_ids } = useCardBulkEditor(initial, 10)
      selectAllCards()
      expect(selected_card_ids.value.sort()).toEqual([1, 2, 3])
    })

    test('clearSelectedCards empties the selection', () => {
      const { selectCard, clearSelectedCards, selected_card_ids } = useCardBulkEditor([], 10)
      selectCard(1)
      clearSelectedCards()
      expect(selected_card_ids.value).toEqual([])
    })

    test('toggleSelectAll selects everything when nothing is selected', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { toggleSelectAll, selected_card_ids } = useCardBulkEditor(initial, 10)
      toggleSelectAll()
      expect(selected_card_ids.value).toHaveLength(2)
    })

    test('toggleSelectAll clears the selection when everything is selected', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { toggleSelectAll, selected_card_ids } = useCardBulkEditor(initial, 10)
      toggleSelectAll()
      toggleSelectAll()
      expect(selected_card_ids.value).toEqual([])
    })

    test('all_cards_selected reflects full selection', () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { selectAllCards, all_cards_selected } = useCardBulkEditor(initial, 10)
      expect(all_cards_selected.value).toBe(false)
      selectAllCards()
      expect(all_cards_selected.value).toBe(true)
    })
  })

  // ── getSelectedCards ───────────────────────────────────────────────────────

  describe('getSelectedCards', () => {
    test('returns selected cards with review stripped by default', () => {
      const initial = [makeCard({ id: 1, review: { due: new Date() } }), makeCard({ id: 2 })]
      const { selectCard, getSelectedCards } = useCardBulkEditor(initial, 10)
      selectCard(1)
      const [c] = getSelectedCards()
      expect('review' in c).toBe(false)
    })

    test('preserves review when clean=false', () => {
      const initial = [makeCard({ id: 1, review: { due: new Date() } })]
      const { selectCard, getSelectedCards } = useCardBulkEditor(initial, 10)
      selectCard(1)
      const [c] = getSelectedCards(false)
      expect('review' in c).toBe(true)
    })
  })

  // ── deleteCards ────────────────────────────────────────────────────────────

  describe('deleteCards', () => {
    test('forwards selected cards to the API and clears selection', async () => {
      const initial = [makeCard({ id: 1 }), makeCard({ id: 2 })]
      const { selectCard, deleteCards, selected_card_ids } = useCardBulkEditor(initial, 10)
      selectCard(1)
      await deleteCards()
      expect(deleteCardsMock).toHaveBeenCalledOnce()
      expect(deleteCardsMock.mock.calls[0][0]).toHaveLength(1)
      expect(selected_card_ids.value).toEqual([])
    })

    test('is a no-op when nothing is selected', async () => {
      const { deleteCards } = useCardBulkEditor([makeCard({ id: 1 })], 10)
      await deleteCards()
      expect(deleteCardsMock).not.toHaveBeenCalled()
    })

    test('still clears selection when the API call rejects', async () => {
      deleteCardsMock.mockRejectedValueOnce(new Error('boom'))
      const { selectCard, deleteCards, selected_card_ids } = useCardBulkEditor(
        [makeCard({ id: 1 })],
        10
      )
      selectCard(1)
      await deleteCards()
      expect(selected_card_ids.value).toEqual([])
    })
  })

  // ── resetCards / setMode / isDuplicate ─────────────────────────────────────

  describe('resetCards / setMode / isDuplicate', () => {
    test('resetCards replaces all_cards and optionally updates deck_id', async () => {
      const { all_cards, resetCards, addCard } = useCardBulkEditor([makeCard({ id: 1 })], 10)
      resetCards([makeCard({ id: 2 }), makeCard({ id: 3 })], 99)
      expect(all_cards.value.map((c) => c.id)).toEqual([2, 3])
      // deck_id updates are reflected in future addCard calls (via new_card.deck_id)
      addCard()
      expect(all_cards.value.at(-1).deck_id).toBe(99)
    })

    test('setMode updates the mode ref', () => {
      const { mode, setMode } = useCardBulkEditor([], 10)
      setMode('edit')
      expect(mode.value).toBe('edit')
    })

    test('isDuplicate returns true when front_text matches another card', () => {
      const initial = [
        makeCard({ id: 1, front_text: 'same' }),
        makeCard({ id: 2, front_text: 'same' })
      ]
      const { isDuplicate } = useCardBulkEditor(initial, 10)
      expect(isDuplicate(initial[0])).toBe(true)
    })

    test('isDuplicate ignores empty cards', () => {
      const initial = [
        makeCard({ id: 1, front_text: '', back_text: '' }),
        makeCard({ id: 2, front_text: '', back_text: '' })
      ]
      const { isDuplicate } = useCardBulkEditor(initial, 10)
      expect(isDuplicate(initial[0])).toBe(false)
    })
  })
})

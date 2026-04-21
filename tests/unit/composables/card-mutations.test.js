import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { ref } from 'vue'
import { card } from '@tests/fixtures/card'

const { insertCardAtMock, saveCardMock, deleteCardsMock, deleteCardsInDeckMock, moveCardsMock } =
  vi.hoisted(() => ({
    insertCardAtMock: vi.fn(),
    saveCardMock: vi.fn(),
    deleteCardsMock: vi.fn(),
    deleteCardsInDeckMock: vi.fn(),
    moveCardsMock: vi.fn()
  }))

vi.mock('@/api/cards', () => ({
  useInsertCardAtMutation: () => ({ mutate: insertCardAtMock, mutateAsync: insertCardAtMock }),
  useSaveCardMutation: () => ({ mutate: saveCardMock, mutateAsync: saveCardMock }),
  useDeleteCardsMutation: () => ({ mutate: deleteCardsMock, mutateAsync: deleteCardsMock }),
  useDeleteCardsInDeckMutation: () => ({
    mutate: deleteCardsInDeckMock,
    mutateAsync: deleteCardsInDeckMock
  }),
  useMoveCardsToDeckMutation: () => ({ mutate: moveCardsMock, mutateAsync: moveCardsMock })
}))

import { useCardMutations } from '@/composables/card-mutations'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

function makeList({
  persisted = [],
  temp_cards = [],
  findTemp = vi.fn(),
  findCard = vi.fn(),
  promoteTemp = vi.fn()
} = {}) {
  return {
    persisted_cards: { value: persisted },
    all_cards: { value: persisted },
    temp_cards: { value: temp_cards },
    getKey: () => '',
    addCard: () => {},
    appendCard: () => {},
    prependCard: () => {},
    findTemp,
    findCard,
    promoteTemp
  }
}

function makeMutations({ list = makeList(), deck_id = 10 } = {}) {
  return useCardMutations({ list, deck_id: ref(deck_id) })
}

beforeEach(() => {
  insertCardAtMock.mockReset()
  insertCardAtMock.mockResolvedValue({ id: 7000, rank: 1500 })
  saveCardMock.mockReset()
  saveCardMock.mockResolvedValue(undefined)
  deleteCardsMock.mockReset()
  deleteCardsMock.mockResolvedValue(undefined)
  deleteCardsInDeckMock.mockReset()
  deleteCardsInDeckMock.mockResolvedValue(0)
  moveCardsMock.mockReset()
  moveCardsMock.mockResolvedValue(undefined)
})

describe('useCardMutations', () => {
  // ── initial state ────────────────────────────────────────────────────────

  test('starts with saving=false', () => {
    const m = makeMutations()
    expect(m.saving.value).toBe(false)
  })

  // ── updateCard — routing between temp insert and real save ───────────────

  describe('updateCard', () => {
    test('routes to insertCardAt for temp ids (id < 0)', async () => {
      const temp = {
        card: { id: -1, deck_id: 10, front_text: '', back_text: '' },
        anchor_id: null,
        side: null
      }
      const list = makeList({ findTemp: () => temp })
      const m = makeMutations({ list })
      await m.updateCard(-1, { front_text: 'Q', back_text: 'A' })
      expect(insertCardAtMock).toHaveBeenCalledOnce()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('passes anchor_id/side from the temp entry to insertCardAt', async () => {
      const temp = {
        card: { id: -2, deck_id: 10, front_text: '', back_text: '' },
        anchor_id: 42,
        side: 'after'
      }
      const list = makeList({ findTemp: () => temp })
      const m = makeMutations({ list })
      await m.updateCard(-2, { front_text: 'X' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.anchor_id).toBe(42)
      expect(args.side).toBe('after')
    })

    test('prefers values.front_text over the temp card state when calling insertCardAt', async () => {
      const temp = {
        card: { id: -3, deck_id: 10, front_text: 'stale', back_text: 'stale-b' },
        anchor_id: null,
        side: null
      }
      const list = makeList({ findTemp: () => temp })
      const m = makeMutations({ list })
      await m.updateCard(-3, { front_text: 'fresh' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.front_text).toBe('fresh')
      expect(args.back_text).toBe('stale-b')
    })

    test('delegates temp promotion to list.promoteTemp on insert success', async () => {
      const temp = {
        card: { id: -4, deck_id: 10, front_text: '', back_text: '' },
        anchor_id: null,
        side: null
      }
      const promoteTemp = vi.fn()
      const list = makeList({ findTemp: () => temp, promoteTemp })
      const m = makeMutations({ list })
      insertCardAtMock.mockResolvedValueOnce({ id: 9000, rank: 2500 })
      await m.updateCard(-4, { front_text: 'X' })
      expect(promoteTemp).toHaveBeenCalledWith(-4, 9000, 2500, { front_text: 'X' })
    })

    test('is a no-op when the temp id has no matching entry', async () => {
      const list = makeList({ findTemp: () => undefined })
      const m = makeMutations({ list })
      await m.updateCard(-99, { front_text: 'X' })
      expect(insertCardAtMock).not.toHaveBeenCalled()
    })

    test('routes to saveCard for real ids (id > 0)', async () => {
      const realCard = makeCard({ id: 42 })
      const list = makeList({ persisted: [realCard], findCard: () => realCard })
      const m = makeMutations({ list })
      await m.updateCard(42, { front_text: 'Updated' })
      expect(saveCardMock).toHaveBeenCalledOnce()
      expect(insertCardAtMock).not.toHaveBeenCalled()
    })

    test('is a no-op when the real id is not found in the list', async () => {
      const list = makeList({ findCard: () => undefined })
      const m = makeMutations({ list })
      await m.updateCard(999, { front_text: 'X' })
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('toggles saving=true during the async save and back to false afterward', async () => {
      const realCard = makeCard({ id: 1 })
      const list = makeList({ findCard: () => realCard })
      let resolveSave
      saveCardMock.mockReturnValueOnce(new Promise((r) => (resolveSave = r)))
      const m = makeMutations({ list })
      const promise = m.updateCard(1, { front_text: 'X' })
      expect(m.saving.value).toBe(true)
      resolveSave()
      await promise
      expect(m.saving.value).toBe(false)
    })

    test('resets saving to false when saveCard rejects', async () => {
      const realCard = makeCard({ id: 1 })
      const list = makeList({ findCard: () => realCard })
      saveCardMock.mockRejectedValueOnce(new Error('boom'))
      const m = makeMutations({ list })
      await expect(m.updateCard(1, { front_text: 'X' })).rejects.toThrow('boom')
      expect(m.saving.value).toBe(false)
    })

    test('resets saving to false when insertCardAt rejects on a temp save', async () => {
      const temp = {
        card: { id: -5, deck_id: 10, front_text: '', back_text: '' },
        anchor_id: null,
        side: null
      }
      const list = makeList({ findTemp: () => temp })
      insertCardAtMock.mockRejectedValueOnce(new Error('boom'))
      const m = makeMutations({ list })
      await expect(m.updateCard(-5, { front_text: 'X' })).rejects.toThrow('boom')
      expect(m.saving.value).toBe(false)
    })
  })

  // ── deleteCards — discriminated args ─────────────────────────────────────

  describe('deleteCards', () => {
    test('routes { cards } to the positive-delete mutation', async () => {
      const m = makeMutations()
      const cards = [makeCard({ id: 1 })]
      await m.deleteCards({ cards })
      expect(deleteCardsMock).toHaveBeenCalledWith(cards)
      expect(deleteCardsInDeckMock).not.toHaveBeenCalled()
    })

    test('routes { except_ids } to the deck-wide-delete mutation', async () => {
      const m = makeMutations({ deck_id: 10 })
      await m.deleteCards({ except_ids: [5, 6] })
      expect(deleteCardsInDeckMock).toHaveBeenCalledWith({ deck_id: 10, except_ids: [5, 6] })
      expect(deleteCardsMock).not.toHaveBeenCalled()
    })

    test('is a no-op when { cards } is empty', async () => {
      const m = makeMutations()
      await m.deleteCards({ cards: [] })
      expect(deleteCardsMock).not.toHaveBeenCalled()
    })

    test('does not clear selection state (controller owns that)', async () => {
      // The mutation layer is deliberately selection-agnostic after the
      // refactor — verify it doesn't touch anything beyond the network call.
      const m = makeMutations()
      await m.deleteCards({ cards: [makeCard({ id: 1 })] })
      expect(deleteCardsMock).toHaveBeenCalledOnce()
      // No selection-layer assertion needed; mutation takes no selection dep.
    })
  })

  // ── moveCards ────────────────────────────────────────────────────────────

  describe('moveCards', () => {
    test('forwards { cards, target_deck_id } to the move mutation as { cards, deck_id }', async () => {
      const m = makeMutations()
      const cards = [makeCard({ id: 7 })]
      await m.moveCards({ cards, target_deck_id: 99 })
      expect(moveCardsMock).toHaveBeenCalledWith({ cards, deck_id: 99 })
    })

    test('is a no-op when the cards array is empty', async () => {
      const m = makeMutations()
      await m.moveCards({ cards: [], target_deck_id: 99 })
      expect(moveCardsMock).not.toHaveBeenCalled()
    })
  })
})

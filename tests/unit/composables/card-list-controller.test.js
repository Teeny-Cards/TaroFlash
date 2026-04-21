import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { ref } from 'vue'
import { card } from '@tests/fixtures/card'

const {
  cardsInfiniteQueryMock,
  deckCardIdsQueryMock,
  insertCardAtMock,
  saveCardMock,
  deleteCardsMock,
  deleteCardsInDeckMock,
  moveCardsMock,
  modalOpenMock,
  alertWarnMock,
  emitSfxMock,
  useInfiniteScrollMock
} = vi.hoisted(() => ({
  cardsInfiniteQueryMock: vi.fn(),
  deckCardIdsQueryMock: vi.fn(),
  insertCardAtMock: vi.fn(),
  saveCardMock: vi.fn(),
  deleteCardsMock: vi.fn(),
  deleteCardsInDeckMock: vi.fn(),
  moveCardsMock: vi.fn(),
  modalOpenMock: vi.fn(),
  alertWarnMock: vi.fn(),
  emitSfxMock: vi.fn(),
  useInfiniteScrollMock: vi.fn()
}))

vi.mock('@/api/cards', () => ({
  useCardsInDeckInfiniteQuery: cardsInfiniteQueryMock,
  useDeckCardIdsQuery: deckCardIdsQueryMock,
  useInsertCardAtMutation: () => ({ mutate: insertCardAtMock, mutateAsync: insertCardAtMock }),
  useSaveCardMutation: () => ({ mutate: saveCardMock, mutateAsync: saveCardMock }),
  useDeleteCardsMutation: () => ({ mutate: deleteCardsMock, mutateAsync: deleteCardsMock }),
  useDeleteCardsInDeckMutation: () => ({
    mutate: deleteCardsInDeckMock,
    mutateAsync: deleteCardsInDeckMock
  }),
  useMoveCardsToDeckMutation: () => ({ mutate: moveCardsMock, mutateAsync: moveCardsMock })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

vi.mock('@/composables/alert', () => ({
  useAlert: () => ({ warn: alertWarnMock })
}))

vi.mock('@/composables/modal', () => ({
  useModal: () => ({ open: modalOpenMock })
}))

vi.mock('@/sfx/bus', () => ({ emitSfx: emitSfxMock }))

vi.mock('@/composables/use-infinite-scroll', () => ({
  useInfiniteScroll: useInfiniteScrollMock
}))

vi.mock('@/components/modals/move-cards.vue', () => ({ default: {} }))

import { useCardListController } from '@/composables/card-list-controller'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

function makeCardsQuery(persisted = []) {
  return {
    data: { value: { pages: [persisted], pageParams: [0] } },
    hasNextPage: { value: false },
    loadNextPage: vi.fn(),
    isLoading: { value: false }
  }
}

function makeIdsQuery(ids = []) {
  return { data: { value: ids } }
}

function makeDeckQuery() {
  return {
    data: ref(null),
    refetch: vi.fn().mockResolvedValue(undefined)
  }
}

function makeController(
  persisted = [],
  ids = persisted.map((c) => c.id),
  deck_query = makeDeckQuery()
) {
  cardsInfiniteQueryMock.mockReturnValueOnce(makeCardsQuery(persisted))
  deckCardIdsQueryMock.mockReturnValueOnce(makeIdsQuery(ids))
  return useCardListController({
    deck_id: 10,
    deck_query
  })
}

describe('useCardListController', () => {
  beforeEach(() => {
    insertCardAtMock.mockReset()
    insertCardAtMock.mockResolvedValue({ id: 9999, rank: 1500 })
    saveCardMock.mockReset()
    saveCardMock.mockResolvedValue(undefined)
    deleteCardsMock.mockReset()
    deleteCardsMock.mockResolvedValue(undefined)
    deleteCardsInDeckMock.mockReset()
    deleteCardsInDeckMock.mockResolvedValue(0)
    moveCardsMock.mockReset()
    moveCardsMock.mockResolvedValue(undefined)
    modalOpenMock.mockReset()
    alertWarnMock.mockReset()
    emitSfxMock.mockReset()
    useInfiniteScrollMock.mockReset()
  })

  // ── Initialization ─────────────────────────────────────────────────────────

  describe('initialization', () => {
    test('all_cards reflects the persisted query pages', () => {
      const { all_cards } = makeController([makeCard({ id: 1 }), makeCard({ id: 2 })])
      expect(all_cards.value.map((c) => c.id)).toEqual([1, 2])
    })

    test('starts in view mode with no selection and not in select-all mode', () => {
      const { mode, selected_card_ids, deselected_ids, select_all_mode, saving } = makeController()
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
      const { all_cards, addCard } = makeController()
      addCard()
      expect(all_cards.value).toHaveLength(1)
      expect(all_cards.value[0].id).toBeLessThan(0)
    })

    test('uses the last persisted card as anchor (side=after) when no neighbors are passed', async () => {
      const { addCard, updateCard, all_cards } = makeController([
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
      const { addCard, updateCard, all_cards } = makeController([
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
      const { addCard, updateCard, all_cards } = makeController([makeCard({ id: 200 })])
      addCard(undefined, 200)
      const temp_id = all_cards.value.find((c) => c.id < 0).id
      await updateCard(temp_id, { front_text: 'X' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.anchor_id).toBe(200)
      expect(args.side).toBe('before')
    })

    test('positions a temp card after its left anchor in the merged list', () => {
      const { all_cards, addCard } = makeController([makeCard({ id: 100 }), makeCard({ id: 200 })])
      addCard(100)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
      expect(all_cards.value[1].id).toBeLessThan(0)
    })

    test('positions a temp card before its right anchor in the merged list', () => {
      const { all_cards, addCard } = makeController([makeCard({ id: 200 })])
      addCard(undefined, 200)
      expect(all_cards.value.map((c) => c.id)).toEqual([all_cards.value[0].id, 200])
      expect(all_cards.value[0].id).toBeLessThan(0)
    })

    test('initializes new temp cards with empty front/back text', () => {
      const { addCard, all_cards } = makeController()
      addCard()
      expect(all_cards.value[0].front_text).toBe('')
      expect(all_cards.value[0].back_text).toBe('')
    })

    test('successive temp adds get unique negative ids', () => {
      const { addCard, all_cards } = makeController()
      addCard()
      addCard()
      const ids = all_cards.value.map((c) => c.id)
      expect(ids[0]).not.toBe(ids[1])
    })
  })

  // ── appendCard / prependCard ───────────────────────────────────────────────

  describe('appendCard / prependCard', () => {
    test('appendCard delegates to addCard with the target as left neighbor', () => {
      const { all_cards, appendCard } = makeController([
        makeCard({ id: 100 }),
        makeCard({ id: 200 })
      ])
      appendCard(100)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
    })

    test('prependCard delegates to addCard with the target as right neighbor', () => {
      const { all_cards, prependCard } = makeController([
        makeCard({ id: 100 }),
        makeCard({ id: 200 })
      ])
      prependCard(200)
      expect(all_cards.value.map((c) => c.id)).toEqual([100, all_cards.value[1].id, 200])
    })
  })

  // ── updateCard — routing between insertCardAt (temp) and saveCard (real) ───

  describe('updateCard', () => {
    test('routes to saveCard for an existing (real-id) card', async () => {
      const real = makeCard({ id: 42 })
      const { updateCard } = makeController([real])
      await updateCard(42, { front_text: 'Updated' })
      expect(saveCardMock).toHaveBeenCalledOnce()
      expect(insertCardAtMock).not.toHaveBeenCalled()
    })

    test('routes to insertCardAt on first save of a temp card', async () => {
      const { addCard, all_cards, updateCard } = makeController()
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'Q', back_text: 'A' })
      expect(insertCardAtMock).toHaveBeenCalledOnce()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('removes the temp card after a successful insert (cache refetch supplies the real one)', async () => {
      const { addCard, all_cards, updateCard } = makeController()
      addCard()
      const temp_id = all_cards.value[0].id
      await updateCard(temp_id, { front_text: 'X' })
      expect(all_cards.value.find((c) => c.id === temp_id)).toBeUndefined()
    })

    test('passes front/back text to insertCardAt, preferring values over temp state', async () => {
      const { addCard, all_cards, updateCard } = makeController()
      addCard()
      await updateCard(all_cards.value[0].id, { front_text: 'from values' })
      const [args] = insertCardAtMock.mock.calls[0]
      expect(args.front_text).toBe('from values')
      expect(args.back_text).toBe('')
    })

    test('is a no-op when the id is not found', async () => {
      const { updateCard } = makeController()
      await updateCard(999, { front_text: 'X' })
      expect(insertCardAtMock).not.toHaveBeenCalled()
      expect(saveCardMock).not.toHaveBeenCalled()
    })

    test('toggles saving around the async work', async () => {
      let resolveSave
      saveCardMock.mockReturnValueOnce(new Promise((r) => (resolveSave = r)))
      const { updateCard, saving } = makeController([makeCard({ id: 1 })])
      const promise = updateCard(1, { front_text: 'X' })
      expect(saving.value).toBe(true)
      resolveSave()
      await promise
      expect(saving.value).toBe(false)
    })

    test('resets saving even if saveCard rejects', async () => {
      saveCardMock.mockRejectedValueOnce(new Error('boom'))
      const { updateCard, saving } = makeController([makeCard({ id: 1 })])
      await expect(updateCard(1, { front_text: 'X' })).rejects.toThrow('boom')
      expect(saving.value).toBe(false)
    })
  })

  // ── selection — positive mode ──────────────────────────────────────────────

  describe('selection — positive mode', () => {
    test('selectCard adds an id once (no duplicates)', () => {
      const { selectCard, selected_card_ids } = makeController()
      selectCard(1)
      selectCard(1)
      expect(selected_card_ids.value).toEqual([1])
    })

    test('deselectCard removes an id', () => {
      const { selectCard, deselectCard, selected_card_ids } = makeController()
      selectCard(1)
      selectCard(2)
      deselectCard(1)
      expect(selected_card_ids.value).toEqual([2])
    })

    test('toggleSelectCard flips selection state', () => {
      const { toggleSelectCard, selected_card_ids } = makeController()
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([1])
      toggleSelectCard(1)
      expect(selected_card_ids.value).toEqual([])
    })

    test('isCardSelected reflects the positive selection set', () => {
      const { selectCard, isCardSelected } = makeController()
      selectCard(1)
      expect(isCardSelected(1)).toBe(true)
      expect(isCardSelected(2)).toBe(false)
    })

    test('selected_count tracks the positive selection length', () => {
      const { selectCard, selected_count } = makeController()
      selectCard(1)
      selectCard(2)
      expect(selected_count.value).toBe(2)
    })

    test('all_cards_selected is true when the positive selection equals the deck total', () => {
      const { selectCard, all_cards_selected } = makeController(
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
      const { selectCard, selectAllCards, selected_card_ids, select_all_mode } = makeController()
      selectCard(1)
      selectAllCards()
      expect(select_all_mode.value).toBe(true)
      expect(selected_card_ids.value).toEqual([])
    })

    test('isCardSelected returns true for everything except deselected ids in select-all mode', () => {
      const { selectAllCards, deselectCard, isCardSelected } = makeController(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      selectAllCards()
      deselectCard(1)
      expect(isCardSelected(1)).toBe(false)
      expect(isCardSelected(2)).toBe(true)
    })

    test('selected_count = total - deselected in select-all mode', () => {
      const { selectAllCards, deselectCard, selected_count } = makeController(
        [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })],
        [1, 2, 3]
      )
      selectAllCards()
      expect(selected_count.value).toBe(3)
      deselectCard(2)
      expect(selected_count.value).toBe(2)
    })

    test('selectCard in select-all mode removes the id from the deselected list', () => {
      const { selectAllCards, deselectCard, selectCard, deselected_ids } = makeController(
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
        makeController([makeCard({ id: 1 })], [1])
      selectAllCards()
      deselectCard(1)
      clearSelectedCards()
      expect(select_all_mode.value).toBe(false)
      expect(deselected_ids.value).toEqual([])
    })

    test('toggleSelectAll selects everything when nothing is selected', () => {
      const { toggleSelectAll, select_all_mode } = makeController(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      toggleSelectAll()
      expect(select_all_mode.value).toBe(true)
    })

    test('toggleSelectAll clears the selection when everything is selected', () => {
      const { toggleSelectAll, select_all_mode, all_cards_selected } = makeController(
        [makeCard({ id: 1 })],
        [1]
      )
      toggleSelectAll()
      expect(all_cards_selected.value).toBe(true)
      toggleSelectAll()
      expect(select_all_mode.value).toBe(false)
    })

    test('all_cards_selected is true in select-all mode iff nothing has been deselected', () => {
      const { selectAllCards, deselectCard, all_cards_selected } = makeController(
        [makeCard({ id: 1 }), makeCard({ id: 2 })],
        [1, 2]
      )
      selectAllCards()
      expect(all_cards_selected.value).toBe(true)
      deselectCard(1)
      expect(all_cards_selected.value).toBe(false)
    })
  })

  // ── card_attributes — projected from deck_query ──────────────────────────

  describe('card_attributes', () => {
    test('defaults to empty front/back when deck data is not yet loaded', () => {
      const ctrl = makeController()
      expect(ctrl.card_attributes.value).toEqual({ front: {}, back: {} })
    })

    test('tracks deck_query.data.card_attributes reactively', () => {
      const deck_query = makeDeckQuery()
      const ctrl = makeController([], [], deck_query)
      deck_query.data.value = { card_attributes: { front: { x: 1 }, back: { y: 2 } } }
      expect(ctrl.card_attributes.value).toEqual({ front: { x: 1 }, back: { y: 2 } })
    })
  })

  // ── setMode ────────────────────────────────────────────────────────────────

  describe('setMode', () => {
    test('updates the mode ref', () => {
      const { mode, setMode } = makeController()
      setMode('edit')
      expect(mode.value).toBe('edit')
    })
  })

  // ── infinite scroll — observeSentinel wires the cards_query into an observer

  describe('observeSentinel', () => {
    test('exposes hasNextPage and isLoading refs sourced from cards_query', () => {
      const cards_query = makeCardsQuery([])
      cards_query.hasNextPage.value = true
      cards_query.isLoading.value = false
      cardsInfiniteQueryMock.mockReturnValueOnce(cards_query)
      deckCardIdsQueryMock.mockReturnValueOnce(makeIdsQuery([]))
      const ctrl = useCardListController({ deck_id: 10, deck_query: makeDeckQuery() })
      expect(ctrl.hasNextPage.value).toBe(true)
      expect(ctrl.isLoading.value).toBe(false)
    })

    test('observeSentinel calls useInfiniteScroll with the sentinel and a delegating loader', () => {
      const cards_query = makeCardsQuery([])
      cardsInfiniteQueryMock.mockReturnValueOnce(cards_query)
      deckCardIdsQueryMock.mockReturnValueOnce(makeIdsQuery([]))
      const ctrl = useCardListController({ deck_id: 10, deck_query: makeDeckQuery() })
      const sentinel = { value: null }
      ctrl.observeSentinel(sentinel)
      expect(useInfiniteScrollMock).toHaveBeenCalledOnce()
      const [observed_ref, on_intersect] = useInfiniteScrollMock.mock.calls[0]
      expect(observed_ref).toBe(sentinel)
      on_intersect()
      expect(cards_query.loadNextPage).toHaveBeenCalledOnce()
    })

    test('enabled getter combines hasNextPage AND !isLoading', () => {
      const cards_query = makeCardsQuery([])
      cards_query.hasNextPage.value = true
      cards_query.isLoading.value = false
      cardsInfiniteQueryMock.mockReturnValueOnce(cards_query)
      deckCardIdsQueryMock.mockReturnValueOnce(makeIdsQuery([]))
      const ctrl = useCardListController({ deck_id: 10, deck_query: makeDeckQuery() })
      ctrl.observeSentinel({ value: null })
      const [, , options] = useInfiniteScrollMock.mock.calls[0]
      expect(options.enabled()).toBe(true)
      cards_query.isLoading.value = true
      expect(options.enabled()).toBe(false)
      cards_query.isLoading.value = false
      cards_query.hasNextPage.value = false
      expect(options.enabled()).toBe(false)
    })
  })

  // ── intent handlers — onCancel / onSelectCard / onDeleteCards / onMoveCards ─

  describe('intent handlers', () => {
    test('onCancel resets mode to view, clears selection, and refetches', async () => {
      const deck_query = makeDeckQuery()
      const ctrl = makeController([makeCard({ id: 1 })], [1], deck_query)
      ctrl.selectCard(1)
      ctrl.setMode('select')
      await ctrl.onCancel()
      expect(ctrl.mode.value).toBe('view')
      expect(ctrl.selected_card_ids.value).toEqual([])
      expect(deck_query.refetch).toHaveBeenCalledOnce()
    })

    test('onSelectCard toggles the id and enters select mode', () => {
      const ctrl = makeController([makeCard({ id: 1 })], [1])
      ctrl.onSelectCard(1)
      expect(ctrl.isCardSelected(1)).toBe(true)
      expect(ctrl.mode.value).toBe('select')
    })

    test('onSelectCard without id just enters select mode without mutating selection', () => {
      const ctrl = makeController([makeCard({ id: 1 })], [1])
      ctrl.onSelectCard()
      expect(ctrl.selected_card_ids.value).toEqual([])
      expect(ctrl.mode.value).toBe('select')
    })

    test('onDeleteCards skips deletion when the user cancels the confirm alert', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(false) })
      const ctrl = makeController([makeCard({ id: 1 })], [1])
      ctrl.selectCard(1)
      await ctrl.onDeleteCards()
      expect(deleteCardsMock).not.toHaveBeenCalled()
    })

    test('onDeleteCards deletes and returns to view mode when confirmed', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(true) })
      const deck_query = makeDeckQuery()
      const ctrl = makeController([makeCard({ id: 1 })], [1], deck_query)
      ctrl.selectCard(1)
      ctrl.setMode('select')
      await ctrl.onDeleteCards()
      expect(deleteCardsMock).toHaveBeenCalledOnce()
      expect(deck_query.refetch).toHaveBeenCalledOnce()
      expect(ctrl.mode.value).toBe('view')
    })

    test('onDeleteCards with an explicit id deletes just that card when nothing else selected', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(true) })
      const ctrl = makeController([makeCard({ id: 7 })], [7])
      await ctrl.onDeleteCards(7)
      const [cards] = deleteCardsMock.mock.calls[0]
      expect(cards.map((c) => c.id)).toEqual([7])
    })

    test('onDeleteCards strips review from the cards it hands to the mutation', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(true) })
      const ctrl = makeController([makeCard({ id: 7, review: { due: new Date() } })], [7])
      await ctrl.onDeleteCards(7)
      const [cards] = deleteCardsMock.mock.calls[0]
      expect('review' in cards[0]).toBe(false)
    })

    test('onDeleteCards does not mutate selection when called with an explicit id', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(false) })
      const ctrl = makeController([makeCard({ id: 7 })], [7])
      await ctrl.onDeleteCards(7)
      expect(ctrl.selected_card_ids.value).toEqual([])
    })

    test('onDeleteCards in select-all mode calls deleteCardsInDeck with except_ids', async () => {
      alertWarnMock.mockReturnValueOnce({ response: Promise.resolve(true) })
      const ctrl = makeController([makeCard({ id: 1 }), makeCard({ id: 2 })], [1, 2])
      ctrl.selectAllCards()
      ctrl.deselectCard(1)
      await ctrl.onDeleteCards()
      expect(deleteCardsInDeckMock).toHaveBeenCalledWith({ deck_id: 10, except_ids: [1] })
      expect(deleteCardsMock).not.toHaveBeenCalled()
      expect(ctrl.select_all_mode.value).toBe(false)
    })

    test('onDeleteCards is a no-op when nothing is selected and no id is provided', async () => {
      const ctrl = makeController([makeCard({ id: 1 })], [1])
      await ctrl.onDeleteCards()
      expect(alertWarnMock).not.toHaveBeenCalled()
      expect(deleteCardsMock).not.toHaveBeenCalled()
      expect(deleteCardsInDeckMock).not.toHaveBeenCalled()
    })

    test('onMoveCards is a no-op when called without an id and nothing is selected', async () => {
      const ctrl = makeController([makeCard({ id: 1 })], [1])
      await ctrl.onMoveCards()
      expect(modalOpenMock).not.toHaveBeenCalled()
    })

    test('onMoveCards opens the move modal and fires the move mutation on confirmation', async () => {
      modalOpenMock.mockReturnValueOnce({ response: Promise.resolve({ deck_id: 42 }) })
      const ctrl = makeController([makeCard({ id: 7 })], [7])
      await ctrl.onMoveCards(7)
      expect(modalOpenMock).toHaveBeenCalledOnce()
      expect(moveCardsMock).toHaveBeenCalledWith({
        cards: expect.any(Array),
        deck_id: 42
      })
    })

    test('onMoveCards does not fire the move mutation when the modal is dismissed', async () => {
      modalOpenMock.mockReturnValueOnce({ response: Promise.resolve(undefined) })
      const ctrl = makeController([makeCard({ id: 7 })], [7])
      await ctrl.onMoveCards(7)
      expect(moveCardsMock).not.toHaveBeenCalled()
    })

    test('onMoveCards does not mutate selection state', async () => {
      modalOpenMock.mockReturnValueOnce({ response: Promise.resolve(undefined) })
      const ctrl = makeController([makeCard({ id: 7 })], [7])
      await ctrl.onMoveCards(7)
      expect(ctrl.isCardSelected(7)).toBe(false)
    })
  })
})

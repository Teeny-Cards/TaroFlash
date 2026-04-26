import { computed, ref, type Ref } from 'vue'
import { useInfiniteScroll } from '@/composables/use-infinite-scroll'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'
import { useDeckQuery } from '@/api/decks'
import { useVirtualCardList, type CardEntry } from './virtual-card-list'
import { useCardSelection } from './card-selection'
import { useCardMutations } from './card-mutations'
import { useCardCarousel } from './card-carousel'
import { useCardActions } from './card-actions'

export type CardListController = ReturnType<typeof useCardListController>

type Options = {
  deck_id: number
}

/**
 * Single root composable for the deck-editor card list. Wires the infinite
 * cards query, deck query, virtual list, selection, mutations, carousel, and
 * intent actions together, and exposes the consolidated surface a single
 * `provide('card-editor')` hands to every consumer (list, grid, list-item,
 * list-item-card, card-importer, mode-toolbar, deck-hero).
 *
 * Owns:
 * - `mode` UI state (view / edit / import-export). Selection is orthogonal:
 *   `is_selecting` flips on the moment any card is selected, regardless of
 *   which mode is active.
 * - the `saving` flag and the INSERT-vs-UPDATE routing in `updateCard`.
 *
 * Calls `useDeckQuery` once internally and forwards `deck.card_count` into
 * `useCardSelection` and `useCardCarousel`. Pinia Colada dedupes by key, so
 * other consumers (e.g. the deck overview panel) holding the same handle
 * share the cache entry.
 *
 * @param opts.deck_id - Numeric deck id this controller is scoped to.
 *
 * @example
 * const editor = useCardListController({ deck_id })
 * provide('card-editor', editor)
 */
export function useCardListController(opts: Options) {
  const cards_query = useCardsInDeckInfiniteQuery(() => opts.deck_id)
  const deck_query = useDeckQuery(() => opts.deck_id)

  const card_count = computed(() => deck_query.data.value?.card_count ?? 0)

  const list = useVirtualCardList(cards_query, opts.deck_id)
  const selection = useCardSelection(card_count)
  const mutations = useCardMutations(opts.deck_id)

  const mode = ref<CardEditorMode>('view')
  const saving = ref(false)

  const card_attributes = computed<DeckCardAttributes>(() => ({
    front: deck_query.data.value?.card_attributes?.front ?? {},
    back: deck_query.data.value?.card_attributes?.back ?? {}
  }))

  const carousel = useCardCarousel({ list, cards_query, card_count })

  /** Set the editor's UI mode (view / edit / import-export). */
  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  const actions = useCardActions({
    list,
    selection,
    mutations,
    deck_query,
    deck_id: opts.deck_id,
    setMode
  })

  /**
   * Wire a template-ref sentinel element to the infinite-scroll loader.
   * Pages load when the sentinel intersects the viewport, gated on
   * `hasNextPage && !isLoading` to avoid duplicate fetches.
   */
  function observeSentinel(sentinel: Ref<HTMLElement | null>) {
    useInfiniteScroll(sentinel, () => cards_query.loadNextPage(), {
      enabled: () => cards_query.hasNextPage.value && !cards_query.isLoading.value
    })
  }

  /** Run an async write with the `saving` flag toggled on for the duration. */
  async function withSaving<T>(fn: () => Promise<T>): Promise<T> {
    saving.value = true
    try {
      return await fn()
    } finally {
      saving.value = false
    }
  }

  /** Insert the staged temp via `insert_card_at` and promote it on success. */
  async function insertTemp(temp_id: number, entry: CardEntry, values: Partial<Card>) {
    const inserted = await mutations.insertCard({
      deck_id: opts.deck_id,
      anchor_id: entry.anchor_id,
      side: entry.side,
      front_text: values.front_text ?? entry.card.front_text ?? '',
      back_text: values.back_text ?? entry.card.back_text ?? ''
    })

    list.promoteTemp(temp_id, inserted.id, inserted.rank, values)
  }

  /**
   * Persist an edit. Routes to INSERT on the first save of an unpromoted
   * temp; otherwise UPDATE. No-op when the id matches nothing.
   */
  async function updateCard(id: number, values: Partial<Card>) {
    const entry = list.findEntryByCardId(id)

    if (entry && entry.real_id === null) return withSaving(() => insertTemp(id, entry, values))

    const card = entry?.card ?? list.findCard(id)
    if (!card) return

    return withSaving(() => mutations.saveCard(card, values))
  }

  return {
    // list — rendered cards + add/append/prepend
    all_cards: list.all_cards,
    addCard: list.addCard,
    appendCard: list.appendCard,
    prependCard: list.prependCard,

    // selection — predicates, actions, and derived counts
    isCardSelected: selection.isCardSelected,
    selectCard: selection.selectCard,
    deselectCard: selection.deselectCard,
    toggleSelectCard: selection.toggleSelectCard,
    selectAllCards: selection.selectAllCards,
    clearSelectedCards: selection.clearSelectedCards,
    toggleSelectAll: selection.toggleSelectAll,
    enterSelection: selection.enterSelection,
    exitSelection: selection.exitSelection,
    is_selecting: selection.is_selecting,
    selected_card_ids: selection.selected_card_ids,
    deselected_ids: selection.deselected_ids,
    select_all_mode: selection.select_all_mode,
    selected_count: selection.selected_count,
    all_cards_selected: selection.all_cards_selected,
    total_card_count: selection.total_card_count,

    // writes — in-flight flag + edit entry-point
    saving,
    updateCard,

    // deck-derived
    card_attributes,
    deck_id: opts.deck_id,

    // UI state
    mode,
    setMode,

    // infinite scroll
    hasNextPage: cards_query.hasNextPage,
    isLoading: cards_query.isLoading,
    observeSentinel,
    loadNextPage: cards_query.loadNextPage,

    // carousel — capacity is set by the card-grid once it has measured;
    // page state is consumed by both the grid (visible_cards) and the
    // mode-view toolbar (counter + prev/next buttons)
    setVisibleCapacity: carousel.setVisibleCapacity,
    page: carousel.page,
    page_size: carousel.page_size,
    page_direction: carousel.page_direction,
    total_pages: carousel.total_pages,
    visible_cards: carousel.visible_cards,
    is_page_loading: carousel.is_page_loading,
    prevPage: carousel.prevPage,
    nextPage: carousel.nextPage,
    can_paginate: carousel.can_paginate,

    // intent handlers — what the templates call on user actions
    onCancel: actions.onCancel,
    onDeleteCards: actions.onDeleteCards,
    onSelectCard: actions.onSelectCard,
    onMoveCards: actions.onMoveCards
  }
}

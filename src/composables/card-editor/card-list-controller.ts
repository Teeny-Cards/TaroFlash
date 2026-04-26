import { computed, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlert } from '@/composables/alert'
import { useModal } from '@/composables/modal'
import { useInfiniteScroll } from '@/composables/use-infinite-scroll'
import { emitSfx } from '@/sfx/bus'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'
import { useDeckQuery } from '@/api/decks'
import MoveCardsModal from '@/components/modals/move-cards.vue'
import { useVirtualCardList, type CardEntry } from './virtual-card-list'
import { useCardSelection } from './card-selection'
import { useCardMutations } from './card-mutations'

export type CardEditorMode = 'view' | 'edit' | 'import-export'
export type CardListController = ReturnType<typeof useCardListController>

type Options = {
  deck_id: number
}

/**
 * Single root composable for the deck-editor card list. Wires the infinite
 * cards query, deck query, virtual list, selection, and mutations together,
 * and exposes the consolidated surface a single `provide('card-editor')`
 * hands to every consumer (list, grid, list-item, list-item-card,
 * card-importer, bulk-select-toolbar).
 *
 * Owns:
 * - `mode` UI state (view / edit / import-export) — user-chosen view.
 *   Selection is orthogonal: `is_selecting` flips on the moment any card is
 *   selected, regardless of which mode is active.
 * - intent handlers (`onCancel`, `onDeleteCards`, `onSelectCard`,
 *   `onMoveCards`) which compose modal + alert + sfx around the underlying
 *   mutations
 * - the infinite-scroll wiring (`observeSentinel`)
 *
 * Calls `useDeckQuery` internally; Pinia Colada dedupes by key so other
 * consumers (e.g. the deck overview panel) holding the same handle share
 * the cache entry — no extra fetch.
 *
 * @param opts.deck_id - Numeric deck id this controller is scoped to.
 *
 * @example
 * const editor = useCardListController({ deck_id })
 * provide('card-editor', editor)
 */
export function useCardListController(opts: Options) {
  const deck_id = ref<number | undefined>(opts.deck_id)

  const cards_query = useCardsInDeckInfiniteQuery(() => opts.deck_id)
  const deck_query = useDeckQuery(() => opts.deck_id)

  const list = useVirtualCardList(cards_query, deck_id)
  const selection = useCardSelection(() => opts.deck_id)
  const mutations = useCardMutations(deck_id)

  const saving = ref(false)

  const card_attributes = computed<DeckCardAttributes>(() => ({
    front: deck_query.data.value?.card_attributes?.front ?? {},
    back: deck_query.data.value?.card_attributes?.back ?? {}
  }))

  const { t } = useI18n()
  const modal = useModal()
  const alert = useAlert()

  const mode = ref<CardEditorMode>('view')

  /** Set the editor's UI mode (view / edit / import-export). */
  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

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

  const visible_capacity = ref(0)

  /**
   * Reported by the card-grid once it has measured its visible area. Drives
   * `page_size`, `total_pages`, and `visible_cards`. Stays at 0 until the
   * grid mounts and reports — first paint shows a single card so the grid
   * has a child to measure (see `visible_cards`).
   */
  function setVisibleCapacity(n: number) {
    visible_capacity.value = n
  }

  const page = ref(0)
  const page_size = computed(() => Math.max(1, visible_capacity.value))
  const total_pages = computed(() =>
    Math.max(1, Math.ceil((deck_query.data.value?.card_count ?? 0) / page_size.value))
  )
  const visible_cards = computed(() => {
    if (visible_capacity.value === 0) return list.all_cards.value.slice(0, 1)
    const start = page.value * page_size.value
    return list.all_cards.value.slice(start, start + page_size.value)
  })
  const can_prev_page = computed(() => total_pages.value > 1)
  const can_next_page = computed(() => total_pages.value > 1)

  // 'forward' = nextPage was last invoked (incoming from right);
  // 'backward' = prevPage. Drives the page-transition direction in the grid.
  const page_direction = ref<'forward' | 'backward'>('forward')

  /** Step back one page; wraps from page 0 to the last page. */
  function prevPage() {
    if (total_pages.value <= 1) return
    page_direction.value = 'backward'
    page.value = (page.value - 1 + total_pages.value) % total_pages.value
    emitSfx('ui.slide_up')
  }

  /** Step forward one page; wraps from the last page back to page 0. */
  function nextPage() {
    if (total_pages.value <= 1) return
    page_direction.value = 'forward'
    page.value = (page.value + 1) % total_pages.value
    emitSfx('ui.slide_up')
  }

  watch(total_pages, (n) => {
    if (page.value > n - 1) page.value = Math.max(0, n - 1)
  })

  watch([page, page_size], async () => {
    const needed = (page.value + 1) * page_size.value
    if (
      needed > list.all_cards.value.length &&
      cards_query.hasNextPage.value &&
      !cards_query.isLoading.value
    ) {
      await cards_query.loadNextPage()
    }
  })

  /**
   * Loaded persisted cards that the current selection covers, with `review`
   * stripped so the result is safe to spread into write payloads.
   *
   * In select-all mode this is incomplete by design — only the loaded pages
   * are reflected. The select-all delete path uses
   * `deleteCards({ except_ids })` instead so the FE never has to enumerate
   * every card.
   */
  function loadedSelectedCards(): Card[] {
    return selection
      .filterSelected(list.persisted_cards.value)
      .map(({ review: _review, ...rest }) => rest as Card)
  }

  /**
   * Build a card-set payload by combining the current selection with an
   * optional additional card id:
   *
   * - `additional_card_id` undefined           → just the current selection.
   * - `additional_card_id` already in selection → just the current selection (no duplicate).
   * - `additional_card_id` new                  → the selection plus that one extra card.
   *
   * Strips `review` from the appended card so the result is safe to spread
   * into write payloads, matching `loadedSelectedCards`. Does not mutate
   * selection state — callers decide whether to clear it after the action.
   */
  function collectCards(additional_card_id: number | undefined): Card[] {
    const selected = loadedSelectedCards()

    if (additional_card_id === undefined) return selected
    if (selection.isCardSelected(additional_card_id)) return selected

    const card = list.findCard(additional_card_id)
    if (!card) return selected

    const { review: _review, ...without_review } = card
    return [...selected, without_review as Card]
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
      deck_id: deck_id.value!,
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

  /**
   * Exit the current mode: drop selection state, exit selection mode, return
   * to view mode, and refetch the deck so any unsaved derived state re-syncs.
   */
  async function onCancel() {
    emitSfx('ui.card_drop')
    setMode('view')
    selection.exitSelection()

    await deck_query.refetch()
  }

  /** Show the delete-N-cards confirm alert. Resolves to the user's choice. */
  function confirmDelete(count: number) {
    const { response } = alert.warn({
      title: t('alert.delete-card', { count }),
      message: t('alert.delete-card.message', { count }),
      confirmLabel: t('common.delete'),
      confirmAudio: 'ui.trash_crumple_short'
    })
    return response
  }

  /** Cleanup applied after any successful delete: drop selection, refetch, exit. */
  async function afterDelete() {
    selection.exitSelection()
    await deck_query.refetch()
    setMode('view')
  }

  /**
   * Resolve the args for the underlying delete mutation, deduced from the
   * current selection state. Returns `null` when there's nothing to delete.
   */
  function resolveDeleteArgs(
    additional_card_id?: number
  ): { count: number; args: { except_ids: number[] } | { cards: Card[] } } | null {
    if (selection.select_all_mode.value) {
      return {
        count: selection.selected_count.value,
        args: { except_ids: selection.deselected_ids.value.slice() }
      }
    }

    const cards = collectCards(additional_card_id)
    if (cards.length === 0) return null

    return { count: cards.length, args: { cards } }
  }

  /**
   * Confirm + delete a set of cards. Source of the set:
   *
   * - select-all mode             → deck-wide via `{ except_ids }`.
   * - `additional_card_id` given  → that card plus the current selection.
   * - neither                     → the current selection only.
   *
   * No-op when there's nothing to delete or the user dismisses the alert.
   */
  async function onDeleteCards(additional_card_id?: number) {
    const resolved = resolveDeleteArgs(additional_card_id)
    if (!resolved) return
    if (!(await confirmDelete(resolved.count))) return

    await mutations.deleteCards(resolved.args)
    await afterDelete()
  }

  /**
   * Toggle selection for `id` (when given) and enter selection mode. Used by
   * both the row checkbox click and the "select" item-options action — the
   * latter passes no id to enter selection mode without altering anything.
   * Selection mode is orthogonal to the editor mode (`view` / `edit` /
   * `import-export`), so this never touches `mode`.
   */
  function onSelectCard(id?: number) {
    if (id !== undefined) selection.toggleSelectCard(id)
    selection.enterSelection()
    emitSfx('ui.etc_camera_shutter')
  }

  /**
   * Open the move-cards modal with the given cards, paired with the open /
   * close sfx. Returns the user's chosen destination deck or `undefined` if
   * they dismissed the modal.
   */
  function openMoveModal(cards: Card[]) {
    emitSfx('ui.double_pop_up')

    const { response } = modal.open<{ deck_id: number }>(MoveCardsModal, {
      backdrop: true,
      props: { cards, current_deck_id: opts.deck_id }
    })
    response.then(() => emitSfx('ui.double_pop_down'))

    return response
  }

  /**
   * Open the move-cards modal for the current selection plus an optional
   * additional card. On confirm, runs the move mutation against the chosen
   * destination deck.
   *
   * No-op when there's nothing to move or the user dismisses the modal.
   */
  async function onMoveCards(additional_card_id?: number) {
    const cards = collectCards(additional_card_id)
    if (cards.length === 0) return

    const target = await openMoveModal(cards)
    if (!target) return

    await mutations.moveCards({ cards, target_deck_id: target.deck_id })
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
    deck_id,

    // UI state
    mode,
    setMode,

    // infinite scroll
    hasNextPage: cards_query.hasNextPage,
    isLoading: cards_query.isLoading,
    observeSentinel,
    loadNextPage: cards_query.loadNextPage,

    // pagination — capacity is set by the card-grid once it has measured;
    // page state is consumed by both the grid (visible_cards) and the
    // mode-view toolbar (counter + prev/next buttons)
    setVisibleCapacity,
    page,
    page_size,
    page_direction,
    total_pages,
    visible_cards,
    prevPage,
    nextPage,
    can_prev_page,
    can_next_page,

    // intent handlers — what the templates call on user actions
    onCancel,
    onDeleteCards,
    onSelectCard,
    onMoveCards
  }
}

import { computed, ref, type MaybeRefOrGetter } from 'vue'
import { useDeckQuery } from '@/api/decks'

export type CardSelection = ReturnType<typeof useCardSelection>

/**
 * Selection state for the deck-editor card list, modelled as a discriminated
 * union of two modes:
 *
 * - **Positive mode** (default) — `selected_card_ids` enumerates the chosen
 *   cards. Empty array means nothing is selected.
 * - **Select-all mode** (`select_all_mode === true`) — every card in the
 *   deck is conceptually selected EXCEPT those listed in `deselected_ids`.
 *   The deck-wide variant exists so the FE never has to materialise a
 *   10k-element id array client-side; the server-side delete RPC takes
 *   `except_ids` directly.
 *
 * Use `isCardSelected(id)` to ask the question without caring which mode
 * is active. Use `filterSelected(cards)` to pull the selected subset out
 * of any list of cards.
 *
 * `total_card_count` reads `deck.card_count` from the deck query (sourced
 * from the `decks_with_stats` view). Pinia Colada dedupes by key, so calling
 * `useDeckQuery` here doesn't fetch again when other consumers already hold
 * the same handle.
 *
 * @param deck_id - Reactive deck id (ref, getter, or plain number).
 *
 * @example
 * const selection = useCardSelection(deck_id)
 * selection.toggleSelectCard(card.id)
 * if (selection.all_cards_selected.value) { ... }
 */
export function useCardSelection(deck_id: MaybeRefOrGetter<number>) {
  const deck_query = useDeckQuery(deck_id)

  const selected_card_ids = ref<number[]>([])
  const deselected_ids = ref<number[]>([])
  const select_all_mode = ref(false)
  const is_selecting = ref(false)

  const total_card_count = computed(() => deck_query.data.value?.card_count ?? 0)

  const selected_count = computed(() => {
    if (select_all_mode.value) {
      return Math.max(0, total_card_count.value - deselected_ids.value.length)
    }

    return selected_card_ids.value.length
  })

  const all_cards_selected = computed(() => {
    if (select_all_mode.value) return deselected_ids.value.length === 0
    return total_card_count.value > 0 && selected_card_ids.value.length === total_card_count.value
  })

  /**
   * Enter selection mode. UI then renders selection-aware affordances
   * (checkboxes, bulk-action toolbar) across any editor mode. The flag
   * persists past `clearSelectedCards` — user must explicitly exit.
   */
  function enterSelection() {
    is_selecting.value = true
  }

  /** Exit selection mode and drop any in-flight selection state. */
  function exitSelection() {
    is_selecting.value = false
    clearSelectedCards()
  }

  /**
   * Mode-agnostic predicate: is this card currently selected? In select-all
   * mode this returns true unless the id is in the deselected list.
   */
  function isCardSelected(id: number): boolean {
    if (select_all_mode.value) return !deselected_ids.value.includes(id)
    return selected_card_ids.value.includes(id)
  }

  /**
   * Select a card. In positive mode, appends to `selected_card_ids` (deduped).
   * In select-all mode, removes the id from `deselected_ids` so it's no
   * longer excluded.
   */
  function selectCard(id: number) {
    if (select_all_mode.value) {
      const i = deselected_ids.value.indexOf(id)
      if (i !== -1) deselected_ids.value.splice(i, 1)
      return
    }

    if (!selected_card_ids.value.includes(id)) selected_card_ids.value.push(id)
  }

  /**
   * Deselect a card. In positive mode, removes it from `selected_card_ids`.
   * In select-all mode, appends it to `deselected_ids` (deduped) so it's
   * excluded from the implicit selection.
   */
  function deselectCard(id: number) {
    if (select_all_mode.value) {
      if (!deselected_ids.value.includes(id)) deselected_ids.value.push(id)
      return
    }

    const i = selected_card_ids.value.indexOf(id)
    if (i !== -1) selected_card_ids.value.splice(i, 1)
  }

  /** Flip a card's selection state in whichever mode is active. */
  function toggleSelectCard(id: number) {
    if (isCardSelected(id)) deselectCard(id)
    else selectCard(id)
  }

  /**
   * Switch into select-all mode and reset both lists. Any prior positive
   * selection is discarded — the conceptual "everything" supersedes it.
   */
  function selectAllCards() {
    select_all_mode.value = true
    deselected_ids.value = []
    selected_card_ids.value = []
  }

  /** Exit any selection state: positive list, deselected list, and mode flag. */
  function clearSelectedCards() {
    select_all_mode.value = false
    deselected_ids.value = []
    selected_card_ids.value = []
  }

  /**
   * Toggle the deck-wide select-all. If everything is currently selected
   * (either as a full positive list or as select-all with no deselects),
   * clears; otherwise enters select-all mode.
   */
  function toggleSelectAll() {
    if (all_cards_selected.value) clearSelectedCards()
    else selectAllCards()
  }

  /**
   * Filter `cards` down to those currently selected. Cards with no id (e.g.
   * unsaved temps) are dropped — selection only ever applies to persisted
   * rows because the underlying delete/move RPCs work on real ids.
   */
  function filterSelected(cards: Card[]): Card[] {
    return cards.filter((card) => {
      if (card.id === undefined) return false
      return isCardSelected(card.id)
    })
  }

  return {
    selected_card_ids,
    deselected_ids,
    select_all_mode,
    total_card_count,
    selected_count,
    all_cards_selected,
    is_selecting,
    enterSelection,
    exitSelection,
    isCardSelected,
    selectCard,
    deselectCard,
    toggleSelectCard,
    selectAllCards,
    clearSelectedCards,
    toggleSelectAll,
    filterSelected
  }
}

import type { CardSelection } from '@/composables/card-editor/card-selection'
import type { VirtualCardList } from '@/composables/card-editor/virtual-card-list'

export type DeleteArgs = { except_ids: number[] } | { cards: Card[] }

/**
 * Loaded persisted cards covered by the current selection, with `review`
 * stripped so the result is safe to spread into write payloads.
 *
 * In select-all mode this is incomplete by design — only the loaded pages
 * are reflected. The select-all delete path uses `{ except_ids }` instead so
 * the FE never has to enumerate every card.
 */
export function loadedSelectedCards(
  selection: Pick<CardSelection, 'filterSelected'>,
  list: Pick<VirtualCardList, 'persisted_cards'>
): Card[] {
  return selection
    .filterSelected(list.persisted_cards.value)
    .map(({ review: _review, ...rest }) => rest as Card)
}

/**
 * Build a card-set payload by combining the current selection with an
 * optional additional card id:
 *
 * - `additional_card_id` undefined            → just the current selection.
 * - `additional_card_id` already in selection → just the current selection.
 * - `additional_card_id` new                  → selection plus that card.
 *
 * Strips `review` from the appended card so the result is safe to spread
 * into write payloads. Does not mutate selection state.
 */
export function collectCards(
  selection: Pick<CardSelection, 'filterSelected' | 'isCardSelected'>,
  list: Pick<VirtualCardList, 'persisted_cards' | 'findCard'>,
  additional_card_id: number | undefined
): Card[] {
  const selected = loadedSelectedCards(selection, list)

  if (additional_card_id === undefined) return selected
  if (selection.isCardSelected(additional_card_id)) return selected

  const card = list.findCard(additional_card_id)
  if (!card) return selected

  const { review: _review, ...without_review } = card
  return [...selected, without_review as Card]
}

/**
 * Resolve the args for the underlying delete mutation, deduced from the
 * current selection state. Returns `null` when there is nothing to delete.
 *
 * - select-all mode → `{ except_ids }` for deck-wide delete.
 * - otherwise       → `{ cards }` enumerated from selection + optional id.
 */
export function resolveDeleteArgs(
  selection: Pick<
    CardSelection,
    'select_all_mode' | 'selected_count' | 'deselected_ids' | 'filterSelected' | 'isCardSelected'
  >,
  list: Pick<VirtualCardList, 'persisted_cards' | 'findCard'>,
  additional_card_id?: number
): { count: number; args: DeleteArgs } | null {
  if (selection.select_all_mode.value) {
    return {
      count: selection.selected_count.value,
      args: { except_ids: selection.deselected_ids.value.slice() }
    }
  }

  const cards = collectCards(selection, list, additional_card_id)
  if (cards.length === 0) return null

  return { count: cards.length, args: { cards } }
}

import { useMutation } from '@pinia/colada'
import { debounce } from '@/utils/debounce'
import { saveCard } from '../db'

type SaveCardVars = {
  card: Card
  values: Partial<Card>
}

/**
 * Debounce is keyed by card id so concurrent edits to different cards don't
 * supersede each other. Superseded calls resolve with undefined.
 *
 * Intentionally does not invalidate the deck on settle: the calling component
 * owns the authoritative editor state, so a self-triggered refetch would fight
 * it. Bulk ops (delete, move, deck change) still invalidate explicitly.
 */
export function useSaveCardMutation() {
  return useMutation({
    mutation: ({ card, values }: SaveCardVars) =>
      debounce(() => saveCard(card, values), { key: `card-${card.id}` })
  })
}

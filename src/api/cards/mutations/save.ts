import { useMutation, useQueryCache } from '@pinia/colada'
import { debounce } from '@/utils/debounce'
import { saveCard } from '../db'
import { invalidateDeck } from './_invalidate'

type SaveCardVars = {
  card: Card
  values: Partial<Card>
}

/**
 * Debounce is keyed by card id so concurrent edits to different cards don't
 * supersede each other. Superseded calls resolve with undefined.
 */
export function useSaveCardMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: ({ card, values }: SaveCardVars) =>
      debounce(() => saveCard(card, values), { key: `card-${card.id}` }),
    onSettled: (_data, _error, { card }) => {
      invalidateDeck(queryCache, card.deck_id)
    }
  })
}

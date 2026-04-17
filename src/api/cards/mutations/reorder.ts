import { useMutation, useQueryCache } from '@pinia/colada'
import { reorderCard } from '../db'
import { invalidateDeck } from './_invalidate'

type ReorderCardVars = {
  card_id: number
  deck_id: number
  left_card_id?: number
  right_card_id?: number
}

export function useReorderCardMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (vars: ReorderCardVars) =>
      reorderCard(vars.card_id, vars.left_card_id, vars.right_card_id),
    onSettled: (_data, _error, vars) => {
      invalidateDeck(queryCache, vars.deck_id)
    }
  })
}

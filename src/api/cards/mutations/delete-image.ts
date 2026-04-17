import { useMutation, useQueryCache } from '@pinia/colada'
import { deleteCardImage } from '../db'
import { invalidateDeck } from './_invalidate'

type DeleteCardImageVars = {
  card_id: number
  deck_id: number
  side: 'front' | 'back'
}

export function useDeleteCardImageMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (vars: DeleteCardImageVars) => deleteCardImage(vars.card_id, vars.side),
    onSettled: (_data, _error, vars) => {
      invalidateDeck(queryCache, vars.deck_id)
    }
  })
}

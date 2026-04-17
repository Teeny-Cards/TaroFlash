import { useMutation, useQueryCache } from '@pinia/colada'
import { setCardImage } from '../db'
import { invalidateDeck } from './_invalidate'

type SetCardImageVars = {
  card_id: number
  deck_id: number
  file: File
  side: 'front' | 'back'
}

export function useSetCardImageMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (vars: SetCardImageVars) => setCardImage(vars.card_id, vars.file, vars.side),
    onSettled: (_data, _error, vars) => {
      invalidateDeck(queryCache, vars.deck_id)
    }
  })
}

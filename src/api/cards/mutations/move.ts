import { useMutation, useQueryCache } from '@pinia/colada'
import { moveCard, type MoveCardParams } from '../db'
import { invalidateDeck } from './_invalidate'

export type UseMoveCardMutationParams = MoveCardParams & {
  deck_id: number
}

export function useMoveCardMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: ({ deck_id: _deck_id, ...params }: UseMoveCardMutationParams) => moveCard(params),
    onSettled: (_data, _error, { deck_id }) => {
      invalidateDeck(queryCache, deck_id)
    }
  })
}

import { useMutation, useQueryCache } from '@pinia/colada'
import { insertCard, type InsertCardParams } from '../db'
import { invalidateAllCardCounts, invalidateDeck } from './_invalidate'

export function useInsertCardMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (params: InsertCardParams) => insertCard(params),
    onSettled: (_data, _error, params) => {
      invalidateDeck(queryCache, params.deck_id)
      invalidateAllCardCounts(queryCache)
    }
  })
}

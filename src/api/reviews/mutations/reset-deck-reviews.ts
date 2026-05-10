import { useMutation, useQueryCache } from '@pinia/colada'
import { resetDeckReviews } from '../db'

export function useResetDeckReviewsMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (deck_id: number) => resetDeckReviews(deck_id),
    onSettled: (_data, error, deck_id) => {
      if (error) return
      queryCache.invalidateQueries({ key: ['decks'] })
      queryCache.invalidateQueries({ key: ['deck', deck_id] })
      queryCache.invalidateQueries({ key: ['cards', deck_id] })
    }
  })
}

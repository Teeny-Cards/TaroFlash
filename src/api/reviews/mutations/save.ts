import { useMutation, useQueryCache } from '@pinia/colada'
import type { ReviewLog } from 'ts-fsrs'
import { saveReview } from '../db'

type SaveReviewVars = {
  card_id: number
  deck_id: number
  card: Review
  log: ReviewLog
}

export function useSaveReviewMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (vars: SaveReviewVars) => saveReview(vars.card_id, vars.card, vars.log),
    onSettled: (_data, _error, vars) => {
      queryCache.invalidateQueries({ key: ['decks'] })
      queryCache.invalidateQueries({ key: ['deck', vars.deck_id] })
      queryCache.invalidateQueries({ key: ['cards', vars.deck_id] })
    }
  })
}

import { useMutation, useQueryCache } from '@pinia/colada'
import type { CardBase } from '@type/card'
import { moveCardsToDeck } from '../db'
import { invalidateAllCardCounts, invalidateDeck } from './_invalidate'

type MoveCardsToDeckVars = {
  cards: CardBase[]
  deck_id: number
}

export function useMoveCardsToDeckMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (vars: MoveCardsToDeckVars) => moveCardsToDeck(vars.cards, vars.deck_id),
    onSettled: (_data, _error, vars) => {
      const source_ids = new Set(vars.cards.map((c) => c.deck_id).filter((id) => id !== undefined))
      source_ids.forEach((id) => invalidateDeck(queryCache, id))
      invalidateDeck(queryCache, vars.deck_id)
      invalidateAllCardCounts(queryCache)
    }
  })
}

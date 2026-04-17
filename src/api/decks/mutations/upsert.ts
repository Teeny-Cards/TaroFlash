import { useMutation, useQueryCache } from '@pinia/colada'
import { upsertDeck } from '../db'

export function useUpsertDeckMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (deck: Deck) => upsertDeck(deck),
    onSettled: (_data, _error, deck) => {
      queryCache.invalidateQueries({ key: ['decks'] })
      if (deck.id !== undefined) queryCache.invalidateQueries({ key: ['deck', deck.id] })
    }
  })
}

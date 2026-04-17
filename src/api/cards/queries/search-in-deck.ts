import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { searchCardsInDeck } from '../db'

export function useSearchCardsInDeckQuery(
  deck_id: MaybeRefOrGetter<number>,
  query: MaybeRefOrGetter<string>
) {
  return useQuery({
    key: () => ['cards', toValue(deck_id), 'search', toValue(query)],
    query: () => searchCardsInDeck(toValue(deck_id), toValue(query)),
    enabled: () => toValue(query).length > 0
  })
}

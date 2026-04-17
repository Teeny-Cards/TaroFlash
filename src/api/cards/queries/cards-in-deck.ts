import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { fetchAllCardsByDeckId } from '../db'

export function useCardsInDeckQuery(deck_id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => ['cards', toValue(deck_id)],
    query: () => fetchAllCardsByDeckId(toValue(deck_id))
  })
}

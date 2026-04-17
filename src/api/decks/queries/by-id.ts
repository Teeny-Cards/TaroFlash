import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { fetchDeck } from '../db'

export function useDeckQuery(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => ['deck', toValue(id)],
    query: () => fetchDeck(toValue(id))
  })
}

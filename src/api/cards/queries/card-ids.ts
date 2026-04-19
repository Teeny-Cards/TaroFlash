import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { fetchCardIdsByDeckId } from '../db'

export function useDeckCardIdsQuery(deck_id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => ['cards', toValue(deck_id), 'ids'],
    query: () => fetchCardIdsByDeckId(toValue(deck_id))
  })
}

import { useMutation, useQueryCache } from '@pinia/colada'
import { deleteDeck } from '../db'

export function useDeleteDeckMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (id: number) => deleteDeck(id),
    onSettled: (_data, error, id) => {
      queryCache.invalidateQueries({ key: ['decks'] })
      // On success the row is gone — drop the cached entry without refetch
      // (a refetch would 404). On error the row still exists; leave its
      // cache alone.
      if (!error) queryCache.invalidateQueries({ key: ['deck', id] }, false)
    }
  })
}

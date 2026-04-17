import { useMutation, useQueryCache } from '@pinia/colada'
import { deleteDeck } from '../db'

export function useDeleteDeckMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (id: number) => deleteDeck(id),
    onSettled: (_data, _error, id) => {
      queryCache.invalidateQueries({ key: ['decks'] })
      queryCache.invalidateQueries({ key: ['deck', id] })
    }
  })
}

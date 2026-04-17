import type { useQueryCache } from '@pinia/colada'

type QueryCache = ReturnType<typeof useQueryCache>

export function invalidateDeck(queryCache: QueryCache, deck_id: number | undefined) {
  if (deck_id === undefined) return
  queryCache.invalidateQueries({ key: ['deck', deck_id] })
  queryCache.invalidateQueries({ key: ['cards', deck_id] })
}

export function invalidateAllCardCounts(queryCache: QueryCache) {
  queryCache.invalidateQueries({ key: ['cards', 'count'] })
  queryCache.invalidateQueries({ key: ['decks'] })
}

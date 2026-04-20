import { useQueryCache } from '@pinia/colada'
import { fetchMemberDecks } from '../db'

export function prefetchMemberDecks() {
  const cache = useQueryCache()
  const entry = cache.ensure({ key: ['decks'], query: fetchMemberDecks })
  return cache.fetch(entry)
}

import { useQueryCache } from '@pinia/colada'
import { fetchMemberById } from '../db'

export function prefetchMemberById(id: string) {
  const cache = useQueryCache()
  const entry = cache.ensure({
    key: ['member', id],
    query: () => fetchMemberById(id)
  })
  return cache.fetch(entry)
}

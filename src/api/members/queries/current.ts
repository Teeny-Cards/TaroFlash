import { useQuery } from '@pinia/colada'
import { useSessionStore } from '@/stores/session'
import { fetchMemberById } from '../db'

export function useCurrentMemberQuery() {
  const session = useSessionStore()
  return useQuery({
    key: () => ['member', session.user?.id ?? ''],
    query: async () => {
      const id = session.user?.id
      if (!id) return null
      return fetchMemberById(id)
    },
    enabled: () => Boolean(session.user?.id)
  })
}

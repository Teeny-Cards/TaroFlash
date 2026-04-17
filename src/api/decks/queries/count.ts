import { useQuery } from '@pinia/colada'
import { fetchMemberDeckCount } from '../db'

export function useMemberDeckCountQuery() {
  return useQuery({
    key: ['decks', 'count'],
    query: fetchMemberDeckCount
  })
}

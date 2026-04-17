import { useQuery } from '@pinia/colada'
import { fetchMemberDecks } from '../db'

export function useMemberDecksQuery() {
  return useQuery({
    key: ['decks'],
    query: fetchMemberDecks
  })
}

import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { fetchMemberCardCount } from '../db'

type FetchMemberCardCountOptions = {
  only_due_cards?: boolean
}

export function useMemberCardCountQuery(opts: MaybeRefOrGetter<FetchMemberCardCountOptions> = {}) {
  return useQuery({
    key: () => ['cards', 'count', toValue(opts)],
    query: () => fetchMemberCardCount(toValue(opts))
  })
}

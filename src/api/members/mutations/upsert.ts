import { useMutation, useQueryCache } from '@pinia/colada'
import { upsertMember } from '../db'

export function useUpsertMemberMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (member: Member) => upsertMember(member),
    onSettled: (_data, _error, member) => {
      queryCache.invalidateQueries({ key: ['member', member.id ?? ''] })
    }
  })
}

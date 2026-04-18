import { useMutation, useQueryCache } from '@pinia/colada'
import { changePlan } from '../db'

export function useChangePlanMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (planId: string) => changePlan(planId),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing'] })
      queryCache.invalidateQueries({ key: ['member'] })
    }
  })
}

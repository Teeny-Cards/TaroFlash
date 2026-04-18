import { useMutation, useQueryCache } from '@pinia/colada'
import { cancelSubscription } from '../db'

export function useCancelSubscriptionMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (atPeriodEnd: boolean) => cancelSubscription(atPeriodEnd),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing'] })
      queryCache.invalidateQueries({ key: ['member'] })
    }
  })
}

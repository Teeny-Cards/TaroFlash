import { useMutation, useQueryCache } from '@pinia/colada'
import { cancelSubscription } from '../db'

/**
 * Cancels the caller's subscription. Pass `atPeriodEnd: true` for a soft
 * cancel (plan stays active until the current period ends, user can still
 * call resume); `false` cancels immediately.
 *
 * Invalidates all billing queries and the member profile.
 */
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

import { useMutation, useQueryCache } from '@pinia/colada'
import { resumeSubscription } from '../db'

/**
 * Un-sets `cancel_at_period_end` on a previously soft-cancelled
 * subscription — the plan continues as if the cancel never happened.
 * Only meaningful while the sub is still in its final active period.
 *
 * Invalidates all billing queries and the member profile.
 */
export function useResumeSubscriptionMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => resumeSubscription(),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing'] })
      queryCache.invalidateQueries({ key: ['member'] })
    }
  })
}

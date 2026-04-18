import { useMutation, useQueryCache } from '@pinia/colada'
import { changePlan } from '../db'

/**
 * Switches the caller's active subscription to a new plan. Prorates
 * immediately (`proration_behavior: 'always_invoice'`) so the diff is
 * charged or credited on the spot — the user sees the cost change reflect
 * in their next invoice rather than at the period boundary.
 *
 * Invalidates all billing queries and the member profile (plan label).
 */
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

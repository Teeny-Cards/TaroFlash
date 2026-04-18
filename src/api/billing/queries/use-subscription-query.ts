import { useQuery } from '@pinia/colada'
import { getSubscription } from '../db'

/**
 * Fetches the caller's current Stripe subscription (plan, status, renewal
 * date, default payment method) along with the upcoming invoice preview.
 * Returns `{ subscription: null, upcoming: null }` for free-plan members
 * with no Stripe record.
 *
 * Invalidated by any `['billing', ...]` mutation.
 */
export function useSubscriptionQuery() {
  return useQuery({
    key: ['billing', 'subscription'],
    query: () => getSubscription()
  })
}

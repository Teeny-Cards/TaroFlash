import { useQuery } from '@pinia/colada'
import { getSubscription } from '../db'

export function useSubscriptionQuery() {
  return useQuery({
    key: ['billing', 'subscription'],
    query: () => getSubscription()
  })
}

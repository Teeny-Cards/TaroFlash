import { useQuery } from '@pinia/colada'
import { listPaymentMethods } from '../db'

/**
 * Lists all card payment methods attached to the caller's Stripe customer,
 * plus the id of the current default (used to badge the row and hide the
 * "make default" action on it).
 */
export function usePaymentMethodsQuery() {
  return useQuery({
    key: ['billing', 'payment-methods'],
    query: () => listPaymentMethods()
  })
}

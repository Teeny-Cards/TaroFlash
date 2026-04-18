import { useMutation, useQueryCache } from '@pinia/colada'
import { setDefaultPaymentMethod } from '../db'

/**
 * Updates the Stripe customer's default payment method. The new default is
 * used for the next recurring invoice charge.
 *
 * Invalidates the payment-methods list (to re-badge) and the subscription
 * query (its `default_payment_method` field reflects the new choice).
 */
export function useSetDefaultPaymentMethodMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (paymentMethodId: string) => setDefaultPaymentMethod(paymentMethodId),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing', 'payment-methods'] })
      queryCache.invalidateQueries({ key: ['billing', 'subscription'] })
    }
  })
}

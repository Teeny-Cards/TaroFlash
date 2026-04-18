import { useMutation, useQueryCache } from '@pinia/colada'
import { detachPaymentMethod } from '../db'

/**
 * Removes a saved payment method from the caller's Stripe customer. Detach
 * is non-destructive for past charges — it only prevents future billing
 * against this card.
 *
 * Invalidates the payment-methods list.
 */
export function useDetachPaymentMethodMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (paymentMethodId: string) => detachPaymentMethod(paymentMethodId),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing', 'payment-methods'] })
    }
  })
}

import { useMutation, useQueryCache } from '@pinia/colada'
import { setDefaultPaymentMethod } from '../db'

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

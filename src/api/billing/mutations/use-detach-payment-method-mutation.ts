import { useMutation, useQueryCache } from '@pinia/colada'
import { detachPaymentMethod } from '../db'

export function useDetachPaymentMethodMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (paymentMethodId: string) => detachPaymentMethod(paymentMethodId),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing', 'payment-methods'] })
    }
  })
}

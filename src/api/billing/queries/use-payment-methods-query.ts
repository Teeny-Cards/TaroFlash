import { useQuery } from '@pinia/colada'
import { listPaymentMethods } from '../db'

export function usePaymentMethodsQuery() {
  return useQuery({
    key: ['billing', 'payment-methods'],
    query: () => listPaymentMethods()
  })
}

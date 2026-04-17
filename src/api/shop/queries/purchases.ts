import { useQuery } from '@pinia/colada'
import { fetchPurchaseItems } from '../db'

export function usePurchasesQuery() {
  return useQuery({
    key: ['purchases'],
    query: fetchPurchaseItems
  })
}

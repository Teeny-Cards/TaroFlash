import { useMutation, useQueryCache } from '@pinia/colada'
import { upsertPurchase } from '../db'

export function useUpsertPurchaseMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (purchase: Purchase) => upsertPurchase(purchase),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['purchases'] })
    }
  })
}

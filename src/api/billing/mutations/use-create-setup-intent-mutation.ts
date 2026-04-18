import { useMutation, useQueryCache } from '@pinia/colada'
import { createSetupIntent } from '../db'

export function useCreateSetupIntentMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => createSetupIntent(),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing', 'payment-methods'] })
    }
  })
}

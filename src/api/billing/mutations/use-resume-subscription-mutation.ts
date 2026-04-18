import { useMutation, useQueryCache } from '@pinia/colada'
import { resumeSubscription } from '../db'

export function useResumeSubscriptionMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => resumeSubscription(),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing'] })
      queryCache.invalidateQueries({ key: ['member'] })
    }
  })
}

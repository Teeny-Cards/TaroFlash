import { useMutation } from '@pinia/colada'
import { createSubscription, type CreateSubscriptionArgs } from '../db'

export function useCreateSubscriptionMutation() {
  return useMutation({
    mutation: (args: CreateSubscriptionArgs) => createSubscription(args)
  })
}

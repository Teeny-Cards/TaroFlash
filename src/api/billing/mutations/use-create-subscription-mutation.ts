import { useMutation } from '@pinia/colada'
import { createSubscription, type CreateSubscriptionArgs } from '../db'

/**
 * Creates an incomplete Stripe subscription for the caller's selected plan
 * and returns the PaymentIntent `clientSecret`. The client mounts a Payment
 * Element against that secret and calls `stripe.confirmPayment` to activate
 * the subscription. Used by the initial checkout flow, not plan changes.
 */
export function useCreateSubscriptionMutation() {
  return useMutation({
    mutation: (args: CreateSubscriptionArgs) => createSubscription(args)
  })
}

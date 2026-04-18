import { useMutation, useQueryCache } from '@pinia/colada'
import { createSetupIntent } from '../db'

/**
 * Requests a Stripe SetupIntent and returns its `clientSecret` so the
 * client can mount a Payment Element and call `stripe.confirmSetup` to
 * attach a new card to the customer without an immediate charge.
 * Used by the add-credit-card modal.
 *
 * Invalidates the payment-methods list so the newly attached card appears.
 */
export function useCreateSetupIntentMutation() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => createSetupIntent(),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['billing', 'payment-methods'] })
    }
  })
}

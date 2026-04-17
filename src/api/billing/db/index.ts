import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'

export type CreateSubscriptionArgs = { planId: string }
export type CreateSubscriptionResult = {
  clientSecret: string
  subscriptionId: string
}

export async function createSubscription(
  args: CreateSubscriptionArgs
): Promise<CreateSubscriptionResult> {
  const { data, error } = await supabase.functions.invoke<CreateSubscriptionResult>(
    'create-subscription',
    { body: args }
  )

  if (error || !data?.clientSecret) {
    logger.error(error?.message ?? 'create-subscription returned no clientSecret')
    throw error ?? new Error('No clientSecret returned')
  }

  return data
}

export type CreatePortalSessionArgs = { returnUrl: string }
export type CreatePortalSessionResult = { url: string }

export async function createPortalSession(
  args: CreatePortalSessionArgs
): Promise<CreatePortalSessionResult> {
  const { data, error } = await supabase.functions.invoke<CreatePortalSessionResult>(
    'create-portal-session',
    { body: args }
  )

  if (error || !data?.url) {
    logger.error(error?.message ?? 'create-portal-session returned no url')
    throw error ?? new Error('No url returned')
  }

  return data
}

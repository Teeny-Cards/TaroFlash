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

// Minimal Stripe shapes — full SDK types would require shipping @stripe/stripe
// to the frontend. We read only the fields the UI cares about.

export type StripePrice = {
  id: string
  unit_amount: number | null
  currency: string
  recurring: { interval: 'day' | 'week' | 'month' | 'year' } | null
  product: string | { id: string; name: string }
}

export type StripeSubscriptionItem = {
  id: string
  price: StripePrice
}

export type StripePaymentMethod = {
  id: string
  card: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  } | null
}

export type StripeSubscription = {
  id: string
  status: string
  current_period_end: number
  cancel_at_period_end: boolean
  canceled_at: number | null
  items: { data: StripeSubscriptionItem[] }
  default_payment_method: StripePaymentMethod | string | null
}

export type StripeInvoice = {
  id: string
  number: string | null
  amount_paid: number
  amount_due: number
  currency: string
  status: string | null
  created: number
  hosted_invoice_url: string | null
  invoice_pdf: string | null
}

export type StripeUpcomingInvoice = {
  amount_due: number
  currency: string
  period_end: number
} | null

type ManagePayload =
  | { action: 'get-subscription' }
  | { action: 'list-invoices'; limit?: number }
  | { action: 'list-payment-methods' }
  | { action: 'set-default-payment-method'; paymentMethodId: string }
  | { action: 'detach-payment-method'; paymentMethodId: string }
  | { action: 'create-setup-intent' }
  | { action: 'change-plan'; planId: string }
  | { action: 'cancel'; atPeriodEnd: boolean }
  | { action: 'resume' }

async function manage<T>(body: ManagePayload): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('manage-subscription', { body })
  if (error || data == null) {
    logger.error(error?.message ?? 'manage-subscription returned no data')
    throw error ?? new Error('manage-subscription returned no data')
  }
  return data
}

export type GetSubscriptionResult = {
  subscription: StripeSubscription | null
  upcoming: StripeUpcomingInvoice
}

export function getSubscription() {
  return manage<GetSubscriptionResult>({ action: 'get-subscription' })
}

export function listInvoices(limit?: number) {
  return manage<{ invoices: StripeInvoice[] }>({ action: 'list-invoices', limit })
}

export function listPaymentMethods() {
  return manage<{
    paymentMethods: StripePaymentMethod[]
    defaultPaymentMethodId: string | null
  }>({ action: 'list-payment-methods' })
}

export function setDefaultPaymentMethod(paymentMethodId: string) {
  return manage<{ customer: unknown }>({
    action: 'set-default-payment-method',
    paymentMethodId
  })
}

export function detachPaymentMethod(paymentMethodId: string) {
  return manage<{ paymentMethod: StripePaymentMethod }>({
    action: 'detach-payment-method',
    paymentMethodId
  })
}

export function createSetupIntent() {
  return manage<{ clientSecret: string }>({ action: 'create-setup-intent' })
}

export function changePlan(planId: string) {
  return manage<{ subscription: StripeSubscription }>({ action: 'change-plan', planId })
}

export function cancelSubscription(atPeriodEnd: boolean) {
  return manage<{ subscription: StripeSubscription }>({ action: 'cancel', atPeriodEnd })
}

export function resumeSubscription() {
  return manage<{ subscription: StripeSubscription }>({ action: 'resume' })
}

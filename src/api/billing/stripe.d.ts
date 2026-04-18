// Minimal Stripe shapes — the frontend only reads the fields the UI needs.
// Shipping the full `@stripe/stripe` SDK types would add ~1MB of dead weight.

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

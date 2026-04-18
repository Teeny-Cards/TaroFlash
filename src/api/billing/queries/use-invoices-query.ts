import { useQuery } from '@pinia/colada'
import { listInvoices } from '../db'

/**
 * Lists recent invoices for the caller's Stripe customer — used in the
 * billing history section. Each row links out to the Stripe-hosted invoice
 * URL (and PDF) for full detail and receipts.
 */
export function useInvoicesQuery(limit = 20) {
  return useQuery({
    key: () => ['billing', 'invoices', limit],
    query: () => listInvoices(limit)
  })
}

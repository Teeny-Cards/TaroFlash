import { useQuery } from '@pinia/colada'
import { listInvoices } from '../db'

export function useInvoicesQuery(limit = 20) {
  return useQuery({
    key: () => ['billing', 'invoices', limit],
    query: () => listInvoices(limit)
  })
}

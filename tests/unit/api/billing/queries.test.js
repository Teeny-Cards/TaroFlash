import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useQuerySpy, getSubscriptionMock, listInvoicesMock, listPaymentMethodsMock } = vi.hoisted(
  () => ({
    useQuerySpy: vi.fn((cfg) => cfg),
    getSubscriptionMock: vi.fn(),
    listInvoicesMock: vi.fn(),
    listPaymentMethodsMock: vi.fn()
  })
)

vi.mock('@pinia/colada', () => ({ useQuery: useQuerySpy }))

vi.mock('@/api/billing/db', () => ({
  getSubscription: getSubscriptionMock,
  listInvoices: listInvoicesMock,
  listPaymentMethods: listPaymentMethodsMock
}))

import { useSubscriptionQuery } from '@/api/billing/queries/use-subscription-query'
import { useInvoicesQuery } from '@/api/billing/queries/use-invoices-query'
import { usePaymentMethodsQuery } from '@/api/billing/queries/use-payment-methods-query'

beforeEach(() => {
  useQuerySpy.mockClear()
  getSubscriptionMock.mockClear()
  listInvoicesMock.mockClear()
  listPaymentMethodsMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useQuerySpy.mock.calls.at(-1)[0]
}

describe('useSubscriptionQuery', () => {
  test('keys under ["billing", "subscription"] so mutations can invalidate the prefix', () => {
    const { key } = configFrom(useSubscriptionQuery)
    expect(key).toEqual(['billing', 'subscription'])
  })

  test('delegates to getSubscription', async () => {
    const { query } = configFrom(useSubscriptionQuery)
    await query()
    expect(getSubscriptionMock).toHaveBeenCalled()
  })
})

describe('useInvoicesQuery', () => {
  test('keys include the limit so distinct limits cache separately', () => {
    const { key } = configFrom(() => useInvoicesQuery(5))
    expect(key()).toEqual(['billing', 'invoices', 5])
  })

  test('defaults limit to 20', () => {
    const { key } = configFrom(useInvoicesQuery)
    expect(key()).toEqual(['billing', 'invoices', 20])
  })

  test('delegates to listInvoices with the limit arg', async () => {
    const { query } = configFrom(() => useInvoicesQuery(5))
    await query()
    expect(listInvoicesMock).toHaveBeenCalledWith(5)
  })
})

describe('usePaymentMethodsQuery', () => {
  test('keys under ["billing", "payment-methods"]', () => {
    const { key } = configFrom(usePaymentMethodsQuery)
    expect(key).toEqual(['billing', 'payment-methods'])
  })

  test('delegates to listPaymentMethods', async () => {
    const { query } = configFrom(usePaymentMethodsQuery)
    await query()
    expect(listPaymentMethodsMock).toHaveBeenCalled()
  })
})

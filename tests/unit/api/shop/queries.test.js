import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useQuerySpy, fetchShopItemsMock, fetchPurchaseItemsMock } = vi.hoisted(() => ({
  useQuerySpy: vi.fn((cfg) => cfg),
  fetchShopItemsMock: vi.fn(),
  fetchPurchaseItemsMock: vi.fn()
}))

vi.mock('@pinia/colada', () => ({ useQuery: useQuerySpy }))

vi.mock('@/api/shop/db', () => ({
  fetchShopItems: fetchShopItemsMock,
  fetchPurchaseItems: fetchPurchaseItemsMock
}))

import { useShopItemsQuery } from '@/api/shop/queries/items'
import { usePurchasesQuery } from '@/api/shop/queries/purchases'

beforeEach(() => {
  useQuerySpy.mockClear()
})

function configFrom(hook) {
  hook()
  return useQuerySpy.mock.calls.at(-1)[0]
}

describe('useShopItemsQuery', () => {
  test('uses ["shop", "items"] — shop catalogue is a separate prefix from purchases', () => {
    const { key } = configFrom(useShopItemsQuery)
    expect(key).toEqual(['shop', 'items'])
  })

  test('delegates to fetchShopItems', () => {
    const { query } = configFrom(useShopItemsQuery)
    expect(query).toBe(fetchShopItemsMock)
  })
})

describe('usePurchasesQuery', () => {
  test('uses ["purchases"] — invalidated after any purchase mutation', () => {
    const { key } = configFrom(usePurchasesQuery)
    expect(key).toEqual(['purchases'])
  })

  test('delegates to fetchPurchaseItems', () => {
    const { query } = configFrom(usePurchasesQuery)
    expect(query).toBe(fetchPurchaseItemsMock)
  })
})

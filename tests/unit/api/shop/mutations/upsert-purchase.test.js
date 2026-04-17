import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, upsertPurchaseMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  upsertPurchaseMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/shop/db', () => ({ upsertPurchase: upsertPurchaseMock }))

import { useUpsertPurchaseMutation } from '@/api/shop/mutations/upsert-purchase'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  upsertPurchaseMock.mockClear()
})

function configFrom() {
  useUpsertPurchaseMutation()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useUpsertPurchaseMutation', () => {
  test('mutation delegates to upsertPurchase', async () => {
    const { mutation } = configFrom()
    const purchase = { item_id: 1, member_id: 'm1', quantity: 1 }
    await mutation(purchase)
    expect(upsertPurchaseMock).toHaveBeenCalledWith(purchase)
  })

  test('onSettled invalidates ["purchases"] so the inventory refreshes', () => {
    const { onSettled } = configFrom()
    onSettled(undefined, undefined, { item_id: 1, member_id: 'm1', quantity: 1 })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['purchases'] })
  })
})

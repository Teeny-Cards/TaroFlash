import { describe, test, expect, beforeEach, afterEach } from 'vite-plus/test'
import { signInAsTestUser } from '../setup.js'
import { seedShopItem, deleteShopItem } from '../fixtures.js'
import { fetchShopItems, upsertPurchase, fetchPurchaseItems } from '@/api/shop/db'

let session
let item

beforeEach(async () => {
  session = await signInAsTestUser()
  item = await seedShopItem({ name: `Item ${Date.now()}`, price: 10 })
})

afterEach(async () => {
  await session?.cleanup()
  if (item) await deleteShopItem(item.id)
  session = null
  item = null
})

describe('fetchShopItems (contract)', () => {
  test('returns the seeded shop items', async () => {
    const items = await fetchShopItems()
    expect(items.map((i) => i.id)).toContain(item.id)
  })
})

describe('upsertPurchase / fetchPurchaseItems (contract)', () => {
  test('records the purchase and surfaces it via fetchPurchaseItems', async () => {
    await upsertPurchase({ member_id: session.userId, item_id: item.id, quantity: 2 })

    const purchases = await fetchPurchaseItems()
    const mine = purchases.find((p) => p.item_id === item.id)
    expect(mine).toBeTruthy()
    expect(mine.quantity).toBe(2)
  })

  test('upsert with the same item accumulates quantity', async () => {
    await upsertPurchase({ member_id: session.userId, item_id: item.id, quantity: 1 })
    await upsertPurchase({ member_id: session.userId, item_id: item.id, quantity: 3 })

    const purchases = await fetchPurchaseItems()
    const mine = purchases.find((p) => p.item_id === item.id)
    expect(mine.quantity).toBe(4)
  })
})

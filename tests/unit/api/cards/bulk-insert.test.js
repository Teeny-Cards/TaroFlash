import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn()
}))

vi.mock('@/supabase-client', () => ({
  supabase: { rpc: rpcMock }
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))

import { bulkInsertCardsInDeck } from '@/api/cards/db/bulk-insert'

describe('bulkInsertCardsInDeck', () => {
  beforeEach(() => {
    rpcMock.mockReset()
  })

  test('forwards (deck_id, cards) to the bulk_insert_cards_in_deck RPC', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    const cards = [
      { front_text: 'A', back_text: '1' },
      { front_text: 'B', back_text: '2' }
    ]
    await bulkInsertCardsInDeck({ deck_id: 10, cards })
    expect(rpcMock).toHaveBeenCalledWith('bulk_insert_cards_in_deck', {
      p_deck_id: 10,
      p_cards: cards
    })
  })

  test('returns the inserted rows from the RPC', async () => {
    const inserted = [
      { id: 1, deck_id: 10, front_text: 'A', back_text: '1', rank: 1000 },
      { id: 2, deck_id: 10, front_text: 'B', back_text: '2', rank: 2000 }
    ]
    rpcMock.mockResolvedValueOnce({ data: inserted, error: null })
    const result = await bulkInsertCardsInDeck({ deck_id: 10, cards: [] })
    expect(result).toEqual(inserted)
  })

  test('throws when the RPC returns an error', async () => {
    const err = new Error('not authorized')
    rpcMock.mockResolvedValueOnce({ data: null, error: err })
    await expect(bulkInsertCardsInDeck({ deck_id: 10, cards: [] })).rejects.toBe(err)
  })
})

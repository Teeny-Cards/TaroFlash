import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn()
}))

vi.mock('@/supabase-client', () => ({
  supabase: { rpc: rpcMock }
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))

import { insertCard } from '@/api/cards/db/insert'

describe('insertCard', () => {
  beforeEach(() => {
    rpcMock.mockReset()
  })

  test('calls the insert_card RPC with the expected param shape', async () => {
    rpcMock.mockResolvedValueOnce({ data: [{ id: 1, rank: 1500 }], error: null })

    await insertCard({
      deck_id: 10,
      left_card_id: 1,
      right_card_id: 2,
      front_text: 'Q',
      back_text: 'A'
    })

    expect(rpcMock).toHaveBeenCalledWith('insert_card', {
      p_deck_id: 10,
      p_left_card_id: 1,
      p_right_card_id: 2,
      p_front_text: 'Q',
      p_back_text: 'A'
    })
  })

  test('returns the first row (id + rank) from the RPC response', async () => {
    rpcMock.mockResolvedValueOnce({ data: [{ id: 42, rank: 2500 }], error: null })

    const result = await insertCard({
      deck_id: 10,
      left_card_id: null,
      right_card_id: null,
      front_text: '',
      back_text: ''
    })

    expect(result).toEqual({ id: 42, rank: 2500 })
  })

  test('forwards null neighbors unchanged (used for empty-deck inserts)', async () => {
    rpcMock.mockResolvedValueOnce({ data: [{ id: 1, rank: 1000 }], error: null })

    await insertCard({
      deck_id: 10,
      left_card_id: null,
      right_card_id: null,
      front_text: 'Q',
      back_text: 'A'
    })

    const [, args] = rpcMock.mock.calls[0]
    expect(args.p_left_card_id).toBeNull()
    expect(args.p_right_card_id).toBeNull()
  })

  test('throws when the RPC returns an error', async () => {
    const err = new Error('deck not found')
    rpcMock.mockResolvedValueOnce({ data: null, error: err })

    await expect(
      insertCard({
        deck_id: 10,
        left_card_id: null,
        right_card_id: null,
        front_text: '',
        back_text: ''
      })
    ).rejects.toBe(err)
  })
})

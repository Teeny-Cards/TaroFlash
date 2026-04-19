import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn()
}))

vi.mock('@/supabase-client', () => ({
  supabase: { rpc: rpcMock }
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))

import { moveCard } from '@/api/cards/db/move'

describe('moveCard', () => {
  beforeEach(() => {
    rpcMock.mockReset()
  })

  test('calls the move_card RPC with the param shape', async () => {
    rpcMock.mockResolvedValueOnce({ data: 1500, error: null })
    await moveCard({ card_id: 42, anchor_id: 7, side: 'after' })
    expect(rpcMock).toHaveBeenCalledWith('move_card', {
      p_card_id: 42,
      p_anchor_id: 7,
      p_side: 'after'
    })
  })

  test('returns the new rank from the RPC response', async () => {
    rpcMock.mockResolvedValueOnce({ data: 2500, error: null })
    const rank = await moveCard({ card_id: 1, anchor_id: 2, side: 'before' })
    expect(rank).toBe(2500)
  })

  test('throws when the RPC returns an error', async () => {
    const err = new Error('not authorized')
    rpcMock.mockResolvedValueOnce({ data: null, error: err })
    await expect(moveCard({ card_id: 1, anchor_id: 2, side: 'after' })).rejects.toBe(err)
  })
})

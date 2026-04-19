import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { rpcMock, deleteMock, inMock, fromMock } = vi.hoisted(() => {
  const inMock = vi.fn()
  const deleteMock = vi.fn(() => ({ in: inMock }))
  const fromMock = vi.fn(() => ({ delete: deleteMock }))
  const rpcMock = vi.fn()
  return { rpcMock, deleteMock, inMock, fromMock }
})

vi.mock('@/supabase-client', () => ({
  supabase: { from: fromMock, rpc: rpcMock }
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))

import { deleteCards, deleteCardsInDeck } from '@/api/cards/db/delete'

beforeEach(() => {
  fromMock.mockClear()
  deleteMock.mockClear()
  inMock.mockReset()
  rpcMock.mockReset()
})

describe('deleteCards', () => {
  test('deletes cards by id, dropping rows without a defined id', async () => {
    inMock.mockResolvedValueOnce({ error: null })
    await deleteCards([{ id: 1, deck_id: 10 }, { deck_id: 10 }, { id: 3, deck_id: 10 }])
    expect(fromMock).toHaveBeenCalledWith('cards')
    expect(inMock).toHaveBeenCalledWith('id', [1, 3])
  })

  test('throws when the delete errors', async () => {
    inMock.mockResolvedValueOnce({ error: { message: 'denied' } })
    await expect(deleteCards([{ id: 1, deck_id: 10 }])).rejects.toThrow('denied')
  })
})

describe('deleteCardsInDeck', () => {
  test('calls the delete_cards_in_deck RPC with the param shape', async () => {
    rpcMock.mockResolvedValueOnce({ data: 5, error: null })
    await deleteCardsInDeck({ deck_id: 10, except_ids: [1, 2] })
    expect(rpcMock).toHaveBeenCalledWith('delete_cards_in_deck', {
      p_deck_id: 10,
      p_except_ids: [1, 2]
    })
  })

  test('coerces a missing except_ids to null (matches the RPC NULL semantics: no exceptions)', async () => {
    rpcMock.mockResolvedValueOnce({ data: 5, error: null })
    await deleteCardsInDeck({ deck_id: 10 })
    const [, args] = rpcMock.mock.calls[0]
    expect(args.p_except_ids).toBeNull()
  })

  test('returns the deleted-row count', async () => {
    rpcMock.mockResolvedValueOnce({ data: 47, error: null })
    const n = await deleteCardsInDeck({ deck_id: 10 })
    expect(n).toBe(47)
  })

  test('throws when the RPC errors', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: 'denied' } })
    await expect(deleteCardsInDeck({ deck_id: 10 })).rejects.toThrow('denied')
  })
})

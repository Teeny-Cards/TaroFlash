import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { queryMock, capturedTables, capturedRpcs } = vi.hoisted(() => {
  const queryMock = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn()
  }
  return { queryMock, capturedTables: [], capturedRpcs: [] }
})

vi.mock('@/supabase-client', () => ({
  supabase: {
    from: vi.fn((table) => {
      capturedTables.push(table)
      return queryMock
    }),
    rpc: vi.fn((fn, args) => {
      capturedRpcs.push({ fn, args })
      return queryMock
    })
  }
}))

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({ id: 'member-uuid-1' })
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))

import { supabase } from '@/supabase-client'
import {
  fetchMemberDecks,
  fetchDeck,
  fetchMemberDeckCount,
  upsertDeck,
  deleteDeck
} from '@/api/decks/db'

beforeEach(() => {
  Object.values(queryMock).forEach((fn) => fn.mockReset?.())
  queryMock.select.mockReturnValue(queryMock)
  queryMock.eq.mockReturnValue(queryMock)
  queryMock.order.mockReturnValue(queryMock)
  queryMock.delete.mockReturnValue(queryMock)
  capturedTables.length = 0
  capturedRpcs.length = 0
  supabase.from.mockClear()
  supabase.rpc.mockClear()
})

describe('fetchMemberDecks', () => {
  test('calls decks_with_stats RPC filtered by current member', async () => {
    queryMock.eq.mockResolvedValueOnce({ data: [{ id: 1 }], error: null })
    const result = await fetchMemberDecks()
    expect(capturedRpcs[0].fn).toBe('decks_with_stats')
    expect(capturedRpcs[0].args.p_today_start).toEqual(expect.any(String))
    expect(queryMock.eq).toHaveBeenCalledWith('member_id', 'member-uuid-1')
    expect(result).toEqual([{ id: 1 }])
  })

  test('throws when the query errors', async () => {
    const err = new Error('denied')
    queryMock.eq.mockResolvedValueOnce({ data: null, error: err })
    await expect(fetchMemberDecks()).rejects.toBe(err)
  })
})

describe('fetchDeck', () => {
  test('calls decks_with_stats RPC filtered by id and returns the row', async () => {
    const row = { id: 5, title: 'X', member_display_name: 'Alice' }
    queryMock.single.mockResolvedValueOnce({ data: row, error: null })
    const result = await fetchDeck(5)
    expect(capturedRpcs[0].fn).toBe('decks_with_stats')
    expect(capturedRpcs[0].args.p_today_start).toEqual(expect.any(String))
    expect(queryMock.eq).toHaveBeenCalledWith('id', 5)
    expect(result).toEqual(row)
  })

  test('throws when the query errors', async () => {
    const err = new Error('missing')
    queryMock.single.mockResolvedValueOnce({ data: null, error: err })
    await expect(fetchDeck(5)).rejects.toBe(err)
  })
})

describe('fetchMemberDeckCount', () => {
  test('returns the exact count for the current member', async () => {
    queryMock.eq.mockResolvedValueOnce({ count: 3, error: null })
    const n = await fetchMemberDeckCount()
    expect(capturedTables[0]).toBe('decks')
    expect(queryMock.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
    expect(queryMock.eq).toHaveBeenCalledWith('member_id', 'member-uuid-1')
    expect(n).toBe(3)
  })

  test('returns 0 when count is null', async () => {
    queryMock.eq.mockResolvedValueOnce({ count: null, error: null })
    const n = await fetchMemberDeckCount()
    expect(n).toBe(0)
  })

  test('throws when the query errors', async () => {
    const err = new Error('boom')
    queryMock.eq.mockResolvedValueOnce({ count: null, error: err })
    await expect(fetchMemberDeckCount()).rejects.toBe(err)
  })
})

describe('upsertDeck', () => {
  test('upserts on the decks table and stamps updated_at', async () => {
    queryMock.upsert.mockResolvedValueOnce({ error: null })
    const deck = { id: 1, title: 'T' }
    await upsertDeck(deck)
    expect(capturedTables[0]).toBe('decks')
    const [payload, opts] = queryMock.upsert.mock.calls[0]
    expect(payload.updated_at).toBeTruthy()
    expect(opts).toEqual({ onConflict: 'id' })
  })

  test('throws when the upsert fails', async () => {
    const err = new Error('dup')
    queryMock.upsert.mockResolvedValueOnce({ error: err })
    await expect(upsertDeck({ id: 1 })).rejects.toBe(err)
  })
})

describe('deleteDeck', () => {
  test('calls the delete_deck RPC with the deck id as p_deck_id', async () => {
    supabase.rpc.mockImplementationOnce((fn, args) => {
      capturedRpcs.push({ fn, args })
      return Promise.resolve({ error: null })
    })
    await deleteDeck(42)
    expect(capturedRpcs[0].fn).toBe('delete_deck')
    expect(capturedRpcs[0].args).toEqual({ p_deck_id: 42 })
  })

  test('throws when the RPC errors', async () => {
    const err = new Error('denied')
    supabase.rpc.mockImplementationOnce(() => Promise.resolve({ error: err }))
    await expect(deleteDeck(42)).rejects.toBe(err)
  })
})

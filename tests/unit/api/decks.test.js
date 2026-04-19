import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { queryMock, capturedTables } = vi.hoisted(() => {
  const queryMock = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn()
  }
  return { queryMock, capturedTables: [] }
})

vi.mock('@/supabase-client', () => ({
  supabase: {
    from: vi.fn((table) => {
      capturedTables.push(table)
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
  supabase.from.mockClear()
})

describe('fetchMemberDecks', () => {
  test('reads from decks_with_stats filtered by current member', async () => {
    queryMock.eq.mockResolvedValueOnce({ data: [{ id: 1 }], error: null })
    const result = await fetchMemberDecks()
    expect(capturedTables[0]).toBe('decks_with_stats')
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
  test('reads from decks_with_stats with the member embed only — cards are paginated separately', async () => {
    queryMock.single.mockResolvedValueOnce({ data: { id: 5 }, error: null })
    await fetchDeck(5)
    expect(capturedTables[0]).toBe('decks_with_stats')
    const [selectArg] = queryMock.select.mock.calls[0]
    expect(selectArg).toContain('member:members(display_name)')
    expect(selectArg).not.toContain('cards:cards_with_images')
    expect(queryMock.eq).toHaveBeenCalledWith('id', 5)
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
  test('deletes the given deck by id', async () => {
    queryMock.eq.mockResolvedValueOnce({ error: null })
    await deleteDeck(42)
    expect(capturedTables[0]).toBe('decks')
    expect(queryMock.delete).toHaveBeenCalled()
    expect(queryMock.eq).toHaveBeenCalledWith('id', 42)
  })

  test('throws when the delete fails', async () => {
    const err = new Error('denied')
    queryMock.eq.mockResolvedValueOnce({ error: err })
    await expect(deleteDeck(42)).rejects.toBe(err)
  })
})

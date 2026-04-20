import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { ensureSpy, fetchSpy, fetchMemberDecksMock } = vi.hoisted(() => ({
  ensureSpy: vi.fn(),
  fetchSpy: vi.fn(),
  fetchMemberDecksMock: vi.fn()
}))

vi.mock('@pinia/colada', () => ({
  useQueryCache: () => ({
    ensure: ensureSpy,
    fetch: fetchSpy
  })
}))

vi.mock('@/api/decks/db', () => ({
  fetchMemberDecks: fetchMemberDecksMock
}))

import { prefetchMemberDecks } from '@/api/decks/queries/prefetch'

beforeEach(() => {
  ensureSpy.mockReset()
  fetchSpy.mockReset()
  fetchMemberDecksMock.mockReset()
})

describe('prefetchMemberDecks', () => {
  test('registers the shared ["decks"] key so a later useMemberDecksQuery hits the warmed entry', () => {
    const entry = { id: 'entry' }
    ensureSpy.mockReturnValue(entry)
    fetchSpy.mockResolvedValue({})

    prefetchMemberDecks()

    const [opts] = ensureSpy.mock.calls[0]
    expect(opts.key).toEqual(['decks'])
    expect(opts.query).toBe(fetchMemberDecksMock)
  })

  test('passes the entry returned by ensure straight into fetch so the promise binds to the same cache slot', () => {
    const entry = { id: 'entry' }
    ensureSpy.mockReturnValue(entry)
    fetchSpy.mockResolvedValue({})

    prefetchMemberDecks()

    expect(fetchSpy).toHaveBeenCalledWith(entry)
  })

  test('returns the fetch promise so callers can await the prefetch if they choose to', async () => {
    const data = [{ id: 1 }]
    ensureSpy.mockReturnValue({})
    fetchSpy.mockResolvedValue(data)

    await expect(prefetchMemberDecks()).resolves.toBe(data)
  })
})

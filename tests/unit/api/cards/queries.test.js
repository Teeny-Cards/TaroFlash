import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useQuerySpy, fetchAllCardsByDeckIdMock, searchCardsInDeckMock, fetchMemberCardCountMock } =
  vi.hoisted(() => ({
    useQuerySpy: vi.fn((cfg) => cfg),
    fetchAllCardsByDeckIdMock: vi.fn(),
    searchCardsInDeckMock: vi.fn(),
    fetchMemberCardCountMock: vi.fn()
  }))

vi.mock('@pinia/colada', () => ({ useQuery: useQuerySpy }))

vi.mock('@/api/cards/db', () => ({
  fetchAllCardsByDeckId: fetchAllCardsByDeckIdMock,
  searchCardsInDeck: searchCardsInDeckMock,
  fetchMemberCardCount: fetchMemberCardCountMock
}))

import { useCardsInDeckQuery } from '@/api/cards/queries/cards-in-deck'
import { useSearchCardsInDeckQuery } from '@/api/cards/queries/search-in-deck'
import { useMemberCardCountQuery } from '@/api/cards/queries/member-card-count'

beforeEach(() => {
  useQuerySpy.mockClear()
})

function configFrom(hook) {
  hook()
  return useQuerySpy.mock.calls.at(-1)[0]
}

describe('useCardsInDeckQuery', () => {
  test('uses ["cards", deck_id] — keeps each deck\'s card list in its own cache slot', () => {
    const { key } = configFrom(() => useCardsInDeckQuery(10))
    expect(key()).toEqual(['cards', 10])
  })

  test('key reacts to changes in the deck id source', () => {
    let id = 10
    const { key } = configFrom(() => useCardsInDeckQuery(() => id))
    expect(key()).toEqual(['cards', 10])
    id = 20
    expect(key()).toEqual(['cards', 20])
  })

  test('query fetches cards for the current deck id', async () => {
    fetchAllCardsByDeckIdMock.mockResolvedValueOnce([{ id: 1 }])
    const { query } = configFrom(() => useCardsInDeckQuery(10))
    const result = await query()
    expect(fetchAllCardsByDeckIdMock).toHaveBeenCalledWith(10)
    expect(result).toEqual([{ id: 1 }])
  })
})

describe('useSearchCardsInDeckQuery', () => {
  test('key nests under the deck\'s cards prefix — ["cards", deck_id, "search", query]', () => {
    const { key } = configFrom(() => useSearchCardsInDeckQuery(10, 'foo'))
    expect(key()).toEqual(['cards', 10, 'search', 'foo'])
  })

  test('nested shape means invalidating ["cards", deck_id] also invalidates the search (prefix match)', () => {
    // Pure documentation via assertion — the nesting is what makes this work in production.
    const { key } = configFrom(() => useSearchCardsInDeckQuery(10, 'foo'))
    expect(key()[0]).toBe('cards')
    expect(key()[1]).toBe(10)
  })

  test('enabled is false when the query string is empty — avoids fetching for no-op searches', () => {
    const { enabled } = configFrom(() => useSearchCardsInDeckQuery(10, ''))
    expect(enabled()).toBe(false)
  })

  test('enabled is true once the query string has content', () => {
    let q = ''
    const { enabled } = configFrom(() => useSearchCardsInDeckQuery(10, () => q))
    expect(enabled()).toBe(false)
    q = 'foo'
    expect(enabled()).toBe(true)
  })

  test('query delegates to searchCardsInDeck with the current deck id and query string', async () => {
    searchCardsInDeckMock.mockResolvedValueOnce([])
    const { query } = configFrom(() => useSearchCardsInDeckQuery(10, 'foo'))
    await query()
    expect(searchCardsInDeckMock).toHaveBeenCalledWith(10, 'foo')
  })
})

describe('useMemberCardCountQuery', () => {
  test('uses ["cards", "count", opts] — sits under the cards prefix so card mutations invalidate it', () => {
    const { key } = configFrom(() => useMemberCardCountQuery({ only_due_cards: true }))
    expect(key()).toEqual(['cards', 'count', { only_due_cards: true }])
  })

  test('defaults to an empty opts object when no opts are provided', () => {
    const { key } = configFrom(useMemberCardCountQuery)
    expect(key()).toEqual(['cards', 'count', {}])
  })

  test('query passes opts through to fetchMemberCardCount', async () => {
    fetchMemberCardCountMock.mockResolvedValueOnce(3)
    const { query } = configFrom(() => useMemberCardCountQuery({ only_due_cards: true }))
    await query()
    expect(fetchMemberCardCountMock).toHaveBeenCalledWith({ only_due_cards: true })
  })
})

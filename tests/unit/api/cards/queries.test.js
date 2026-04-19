import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const {
  useQuerySpy,
  useInfiniteQuerySpy,
  fetchAllCardsByDeckIdMock,
  fetchCardsPageByDeckIdMock,
  fetchCardIdsByDeckIdMock,
  searchCardsInDeckMock,
  fetchMemberCardCountMock
} = vi.hoisted(() => ({
  useQuerySpy: vi.fn((cfg) => cfg),
  useInfiniteQuerySpy: vi.fn((cfg) => cfg),
  fetchAllCardsByDeckIdMock: vi.fn(),
  fetchCardsPageByDeckIdMock: vi.fn(),
  fetchCardIdsByDeckIdMock: vi.fn(),
  searchCardsInDeckMock: vi.fn(),
  fetchMemberCardCountMock: vi.fn()
}))

vi.mock('@pinia/colada', () => ({
  useQuery: useQuerySpy,
  useInfiniteQuery: useInfiniteQuerySpy
}))

vi.mock('@/api/cards/db', () => ({
  fetchAllCardsByDeckId: fetchAllCardsByDeckIdMock,
  fetchCardsPageByDeckId: fetchCardsPageByDeckIdMock,
  fetchCardIdsByDeckId: fetchCardIdsByDeckIdMock,
  searchCardsInDeck: searchCardsInDeckMock,
  fetchMemberCardCount: fetchMemberCardCountMock
}))

import { useCardsInDeckQuery } from '@/api/cards/queries/cards-in-deck'
import { useCardsInDeckInfiniteQuery, CARDS_PAGE_SIZE } from '@/api/cards/queries/cards-page'
import { useDeckCardIdsQuery } from '@/api/cards/queries/card-ids'
import { useSearchCardsInDeckQuery } from '@/api/cards/queries/search-in-deck'
import { useMemberCardCountQuery } from '@/api/cards/queries/member-card-count'

beforeEach(() => {
  useQuerySpy.mockClear()
  useInfiniteQuerySpy.mockClear()
})

function configFrom(hook) {
  hook()
  return useQuerySpy.mock.calls.at(-1)[0]
}

function infiniteConfigFrom(hook) {
  hook()
  return useInfiniteQuerySpy.mock.calls.at(-1)[0]
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

describe('useCardsInDeckInfiniteQuery', () => {
  test('uses ["cards", deck_id, "pages", page_size] — nests under the deck cards prefix', () => {
    const { key } = infiniteConfigFrom(() => useCardsInDeckInfiniteQuery(10))
    expect(key()).toEqual(['cards', 10, 'pages', CARDS_PAGE_SIZE])
  })

  test('starts at offset 0', () => {
    const { initialPageParam } = infiniteConfigFrom(() => useCardsInDeckInfiniteQuery(10))
    expect(initialPageParam).toBe(0)
  })

  test('query fetches the page using the current pageParam as offset', async () => {
    fetchCardsPageByDeckIdMock.mockResolvedValueOnce([])
    const { query } = infiniteConfigFrom(() => useCardsInDeckInfiniteQuery(10))
    await query({ pageParam: 100 })
    expect(fetchCardsPageByDeckIdMock).toHaveBeenCalledWith({
      deck_id: 10,
      offset: 100,
      limit: CARDS_PAGE_SIZE
    })
  })

  test('getNextPageParam returns the running total of loaded rows when the last page is full', () => {
    const { getNextPageParam } = infiniteConfigFrom(() => useCardsInDeckInfiniteQuery(10, 2))
    const lastPage = [{}, {}]
    const allPages = [
      [{}, {}],
      [{}, {}]
    ]
    expect(getNextPageParam(lastPage, allPages)).toBe(4)
  })

  test('getNextPageParam returns null when the last page is short — there is no more to fetch', () => {
    const { getNextPageParam } = infiniteConfigFrom(() => useCardsInDeckInfiniteQuery(10, 50))
    expect(getNextPageParam([{}], [[{}]])).toBeNull()
  })
})

describe('useDeckCardIdsQuery', () => {
  test('uses ["cards", deck_id, "ids"] — nests under the deck cards prefix', () => {
    const { key } = configFrom(() => useDeckCardIdsQuery(10))
    expect(key()).toEqual(['cards', 10, 'ids'])
  })

  test('query delegates to fetchCardIdsByDeckId', async () => {
    fetchCardIdsByDeckIdMock.mockResolvedValueOnce([1, 2, 3])
    const { query } = configFrom(() => useDeckCardIdsQuery(10))
    const ids = await query()
    expect(fetchCardIdsByDeckIdMock).toHaveBeenCalledWith(10)
    expect(ids).toEqual([1, 2, 3])
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

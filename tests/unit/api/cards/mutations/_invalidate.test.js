import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { invalidateDeck, invalidateAllCardCounts } from '@/api/cards/mutations/_invalidate'

function makeCache() {
  return { invalidateQueries: vi.fn() }
}

describe('invalidateDeck', () => {
  let cache
  beforeEach(() => {
    cache = makeCache()
  })

  test('no-ops when deck_id is undefined — cards without a deck should not invalidate anything', () => {
    invalidateDeck(cache, undefined)
    expect(cache.invalidateQueries).not.toHaveBeenCalled()
  })

  test('invalidates ["deck", id] so the detail view refetches', () => {
    invalidateDeck(cache, 42)
    expect(cache.invalidateQueries).toHaveBeenCalledWith({ key: ['deck', 42] })
  })

  test('invalidates ["cards", id] — prefix match covers cards-in-deck, its infinite + ids + search variants', () => {
    invalidateDeck(cache, 42)
    // Pinia Colada matches by prefix unless `exact: true`, so this single call
    // refetches every nested entry: ['cards', 42], ['cards', 42, 'pages', N],
    // ['cards', 42, 'ids'], and ['cards', 42, 'search', q].
    expect(cache.invalidateQueries).toHaveBeenCalledWith({ key: ['cards', 42] })
  })

  test('fires exactly two invalidations per deck_id', () => {
    invalidateDeck(cache, 42)
    expect(cache.invalidateQueries).toHaveBeenCalledTimes(2)
  })
})

describe('invalidateAllCardCounts', () => {
  let cache
  beforeEach(() => {
    cache = makeCache()
  })

  test('invalidates ["cards", "count"] so every member-card-count query refetches', () => {
    invalidateAllCardCounts(cache)
    expect(cache.invalidateQueries).toHaveBeenCalledWith({ key: ['cards', 'count'] })
  })

  test('invalidates ["decks"] because decks_with_stats exposes card counts per deck', () => {
    invalidateAllCardCounts(cache)
    expect(cache.invalidateQueries).toHaveBeenCalledWith({ key: ['decks'] })
  })
})

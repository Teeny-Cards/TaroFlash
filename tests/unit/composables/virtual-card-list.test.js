import { describe, test, expect } from 'vite-plus/test'
import { ref } from 'vue'
import { card } from '@tests/fixtures/card'
import { useVirtualCardList } from '@/composables/virtual-card-list'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

function makeCardsQuery(persisted = []) {
  return {
    data: { value: { pages: [persisted], pageParams: [0] } },
    hasNextPage: { value: false },
    isLoading: { value: false },
    loadNextPage: () => {}
  }
}

function makeList(persisted = [], deck_id_n = 10) {
  return useVirtualCardList(makeCardsQuery(persisted), ref(deck_id_n))
}

describe('useVirtualCardList', () => {
  // ── persisted_cards / all_cards ───────────────────────────────────────────

  describe('persisted_cards', () => {
    test('flattens pages from the cards_query into a single array', () => {
      const cards_query = {
        data: {
          value: {
            pages: [[makeCard({ id: 1 })], [makeCard({ id: 2 }), makeCard({ id: 3 })]],
            pageParams: [0, 1]
          }
        },
        hasNextPage: { value: false },
        isLoading: { value: false },
        loadNextPage: () => {}
      }
      const list = useVirtualCardList(cards_query, ref(10))
      expect(list.persisted_cards.value.map((c) => c.id)).toEqual([1, 2, 3])
    })

    test('defaults to an empty array when the query has no data yet', () => {
      const cards_query = {
        data: { value: undefined },
        hasNextPage: { value: false },
        isLoading: { value: false },
        loadNextPage: () => {}
      }
      const list = useVirtualCardList(cards_query, ref(10))
      expect(list.persisted_cards.value).toEqual([])
    })
  })

  // ── addCard — anchor resolution + initial card shape ──────────────────────

  describe('addCard', () => {
    test('creates a temp card with a unique negative id', () => {
      const list = makeList()
      list.addCard()
      expect(list.all_cards.value).toHaveLength(1)
      expect(list.all_cards.value[0].id).toBeLessThan(0)
    })

    test('successive adds yield distinct negative ids', () => {
      const list = makeList()
      list.addCard()
      list.addCard()
      const [a, b] = list.all_cards.value.map((c) => c.id)
      expect(a).not.toBe(b)
    })

    test('uses the left neighbor as anchor with side=after', () => {
      const list = makeList([makeCard({ id: 100 }), makeCard({ id: 200 })])
      list.addCard(100)
      const temp = list.temp_cards.value[0]
      expect(temp.anchor_id).toBe(100)
      expect(temp.side).toBe('after')
    })

    test('uses the right neighbor as anchor with side=before when only right is given', () => {
      const list = makeList([makeCard({ id: 200 })])
      list.addCard(undefined, 200)
      const temp = list.temp_cards.value[0]
      expect(temp.anchor_id).toBe(200)
      expect(temp.side).toBe('before')
    })

    test('anchors to the last persisted card when no neighbors are passed', () => {
      const list = makeList([makeCard({ id: 100 }), makeCard({ id: 200 })])
      list.addCard()
      const temp = list.temp_cards.value[0]
      expect(temp.anchor_id).toBe(200)
      expect(temp.side).toBe('after')
    })

    test('uses anchor=null when the deck is empty (appended to loaded set)', () => {
      const list = makeList()
      list.addCard()
      const temp = list.temp_cards.value[0]
      expect(temp.anchor_id).toBeNull()
    })

    test('initializes new temp cards with empty text and the deck id', () => {
      const list = makeList([], 42)
      list.addCard()
      const temp = list.temp_cards.value[0]
      expect(temp.card.front_text).toBe('')
      expect(temp.card.back_text).toBe('')
      expect(temp.card.deck_id).toBe(42)
    })
  })

  describe('appendCard / prependCard', () => {
    test('appendCard delegates to addCard with the id as left neighbor', () => {
      const list = makeList([makeCard({ id: 50 })])
      list.appendCard(50)
      expect(list.temp_cards.value[0].anchor_id).toBe(50)
      expect(list.temp_cards.value[0].side).toBe('after')
    })

    test('prependCard delegates to addCard with the id as right neighbor', () => {
      const list = makeList([makeCard({ id: 50 })])
      list.prependCard(50)
      expect(list.temp_cards.value[0].anchor_id).toBe(50)
      expect(list.temp_cards.value[0].side).toBe('before')
    })
  })

  // ── all_cards — persisted ∪ temp, merged by anchor ────────────────────────

  describe('all_cards merging', () => {
    test('places a side=after temp immediately after its left anchor', () => {
      const list = makeList([makeCard({ id: 100 }), makeCard({ id: 200 })])
      list.addCard(100)
      expect(list.all_cards.value.map((c) => c.id)).toEqual([100, list.all_cards.value[1].id, 200])
      expect(list.all_cards.value[1].id).toBeLessThan(0)
    })

    test('places a side=before temp immediately before its right anchor', () => {
      const list = makeList([makeCard({ id: 100 })])
      list.addCard(undefined, 100)
      expect(list.all_cards.value.map((c) => c.id)).toEqual([list.all_cards.value[0].id, 100])
      expect(list.all_cards.value[0].id).toBeLessThan(0)
    })

    test('appends a temp whose anchor is not in loaded pages (visual fallback)', () => {
      const list = makeList([makeCard({ id: 100 })])
      list.addCard(999) // anchor not loaded
      expect(list.all_cards.value.at(-1).id).toBeLessThan(0)
    })

    test('appends a temp with null anchor to the tail', () => {
      const list = makeList([makeCard({ id: 100 })])
      list.temp_cards.value.push({
        card: { id: -99, rank: 0, deck_id: 10, front_text: '', back_text: '' },
        anchor_id: null,
        side: null
      })
      expect(list.all_cards.value.at(-1).id).toBe(-99)
    })
  })

  // ── getKey — stable across id migration ───────────────────────────────────

  describe('getKey', () => {
    test('returns a stable local key for a temp card', () => {
      const list = makeList()
      list.addCard()
      const temp = list.all_cards.value[0]
      const key1 = list.getKey(temp)
      const key2 = list.getKey(temp)
      expect(key1).toBe(key2)
      expect(typeof key1).toBe('string')
    })

    test('falls back to card.id when no local key exists (persisted cards)', () => {
      const list = makeList([makeCard({ id: 42 })])
      const persisted = list.persisted_cards.value[0]
      expect(list.getKey(persisted)).toBe(42)
    })

    test('returns a random key when card.id is undefined (defensive)', () => {
      const list = makeList()
      const key = list.getKey({ id: undefined })
      expect(typeof key).toBe('number')
    })
  })

  // ── promoteTemp — the temp → real id handoff ──────────────────────────────

  describe('promoteTemp', () => {
    test('migrates the temp entry from the negative id to the real id in-place', () => {
      const list = makeList()
      list.addCard()
      const temp = list.temp_cards.value[0]
      const old_id = temp.card.id
      list.promoteTemp(old_id, 5001, 1500, { front_text: 'Q' })
      expect(temp.card.id).toBe(5001)
      expect(temp.card.rank).toBe(1500)
      expect(temp.card.front_text).toBe('Q')
    })

    test('carries the stable v-for key across the id migration', () => {
      const list = makeList()
      list.addCard()
      const temp = list.temp_cards.value[0]
      const old_id = temp.card.id
      const key_before = list.getKey(temp.card)
      list.promoteTemp(old_id, 5002, 1600, {})
      const key_after = list.getKey(temp.card)
      expect(key_after).toBe(key_before)
    })

    test('is a no-op when no matching temp exists', () => {
      const list = makeList()
      expect(() => list.promoteTemp(-999, 1, 0, {})).not.toThrow()
    })

    test('dedupes the promoted temp against the eventually-refetched persisted copy', () => {
      const cards_query = {
        data: { value: { pages: [[]], pageParams: [0] } },
        hasNextPage: { value: false },
        isLoading: { value: false },
        loadNextPage: () => {}
      }
      const list = useVirtualCardList(cards_query, ref(10))
      list.addCard()
      const temp = list.temp_cards.value[0]
      const old_id = temp.card.id
      list.promoteTemp(old_id, 7000, 2000, { front_text: 'X' })
      // Simulate the cache refetch landing with the real row
      cards_query.data.value = {
        pages: [[makeCard({ id: 7000, front_text: 'X' })]],
        pageParams: [0]
      }
      const ids = list.all_cards.value.map((c) => c.id)
      expect(ids.filter((id) => id === 7000)).toHaveLength(1)
    })
  })

  // ── findTemp / findCard lookups ───────────────────────────────────────────

  describe('findTemp / findCard', () => {
    test('findTemp returns the entry for a temp id', () => {
      const list = makeList()
      list.addCard()
      const id = list.temp_cards.value[0].card.id
      expect(list.findTemp(id)?.card.id).toBe(id)
    })

    test('findTemp returns undefined for an unknown id', () => {
      const list = makeList()
      expect(list.findTemp(-42)).toBeUndefined()
    })

    test('findCard returns persisted cards', () => {
      const list = makeList([makeCard({ id: 100 })])
      expect(list.findCard(100)?.id).toBe(100)
    })

    test('findCard returns temp cards', () => {
      const list = makeList()
      list.addCard()
      const id = list.temp_cards.value[0].card.id
      expect(list.findCard(id)?.id).toBe(id)
    })

    test('findCard returns undefined when the id is not in the merged list', () => {
      const list = makeList([makeCard({ id: 1 })])
      expect(list.findCard(999)).toBeUndefined()
    })
  })
})

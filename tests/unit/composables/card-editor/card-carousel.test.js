import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { computed, ref } from 'vue'

const { emitSfxMock } = vi.hoisted(() => ({ emitSfxMock: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: emitSfxMock }))

import { useCardCarousel } from '@/composables/card-editor/card-carousel'

function makeList(cards = []) {
  return { all_cards: ref(cards) }
}

function makeCardsQuery({ hasNext = false, loading = false } = {}) {
  return {
    hasNextPage: ref(hasNext),
    isLoading: ref(loading),
    loadNextPage: vi.fn()
  }
}

function makeCarousel({
  cards = [],
  card_count = cards.length,
  hasNext = false,
  loading = false
} = {}) {
  const list = makeList(cards)
  const cards_query = makeCardsQuery({ hasNext, loading })
  const carousel = useCardCarousel({
    list,
    cards_query,
    card_count: computed(() => card_count)
  })
  return { carousel, list, cards_query }
}

async function flushMicrotasks() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useCardCarousel', () => {
  beforeEach(() => emitSfxMock.mockReset())

  // ── initial state ────────────────────────────────────────────────────────

  describe('initial state', () => {
    test('starts at page 0 with forward direction', () => {
      const { carousel } = makeCarousel()
      expect(carousel.page.value).toBe(0)
      expect(carousel.page_direction.value).toBe('forward')
    })

    test('page_size floors at 1 before any capacity is reported', () => {
      const { carousel } = makeCarousel()
      expect(carousel.page_size.value).toBe(1)
    })

    test('total_pages floors at 1 when card_count is zero', () => {
      const { carousel } = makeCarousel({ card_count: 0 })
      carousel.setVisibleCapacity(8)
      expect(carousel.total_pages.value).toBe(1)
    })
  })

  // ── visible_cards ────────────────────────────────────────────────────────

  describe('visible_cards', () => {
    test('returns all_cards.slice(0, 1) before capacity is reported (bootstrap)', () => {
      const cards = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const { carousel } = makeCarousel({ cards })
      expect(carousel.visible_cards.value).toEqual([{ id: 1 }])
    })

    test('windows by page once capacity is set', () => {
      const cards = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
      const { carousel } = makeCarousel({ cards })
      carousel.setVisibleCapacity(4)
      expect(carousel.visible_cards.value.map((c) => c.id)).toEqual([1, 2, 3, 4])
      carousel.nextPage()
      expect(carousel.visible_cards.value.map((c) => c.id)).toEqual([5, 6, 7, 8])
    })
  })

  // ── prev / next paging ───────────────────────────────────────────────────

  describe('prev / next paging', () => {
    test('nextPage wraps from the last page back to 0 and emits sfx', () => {
      const cards = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
      const { carousel } = makeCarousel({ cards })
      carousel.setVisibleCapacity(4)
      carousel.nextPage() // page 1
      carousel.nextPage() // page 2 (last, ceil(10/4)=3)
      carousel.nextPage() // wraps to 0
      expect(carousel.page.value).toBe(0)
      expect(carousel.page_direction.value).toBe('forward')
      expect(emitSfxMock).toHaveBeenCalledWith('ui.slide_up')
    })

    test('prevPage wraps from page 0 to the last page and sets direction=backward', () => {
      const cards = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
      const { carousel } = makeCarousel({ cards })
      carousel.setVisibleCapacity(4)
      carousel.prevPage()
      expect(carousel.page.value).toBe(2)
      expect(carousel.page_direction.value).toBe('backward')
    })

    test('prev / next are no-ops when only one page exists (no sfx)', () => {
      const { carousel } = makeCarousel({ card_count: 4 })
      carousel.setVisibleCapacity(8)
      carousel.prevPage()
      carousel.nextPage()
      expect(carousel.page.value).toBe(0)
      expect(emitSfxMock).not.toHaveBeenCalled()
    })

    test('can_paginate is true only when total_pages > 1', () => {
      const { carousel } = makeCarousel({ card_count: 5 })
      carousel.setVisibleCapacity(10)
      expect(carousel.can_paginate.value).toBe(false)
      carousel.setVisibleCapacity(2)
      expect(carousel.can_paginate.value).toBe(true)
    })
  })

  // ── page clamping when total_pages shrinks ───────────────────────────────

  describe('page clamping', () => {
    test('page is clamped when total_pages shrinks below the current page', async () => {
      const { carousel } = makeCarousel({ card_count: 100 })
      carousel.setVisibleCapacity(10) // total_pages = 10
      carousel.nextPage()
      carousel.nextPage()
      carousel.nextPage() // page = 3
      carousel.setVisibleCapacity(50) // total_pages = 2 → clamp page to 1
      await flushMicrotasks()
      expect(carousel.page.value).toBeLessThanOrEqual(1)
    })
  })

  // ── prev/next page-number labels ─────────────────────────────────────────

  describe('prev_page_number / next_page_number', () => {
    test('prev wraps to the last page when on page 0', () => {
      const { carousel } = makeCarousel({ card_count: 30 })
      carousel.setVisibleCapacity(10) // total_pages = 3
      expect(carousel.page.value).toBe(0)
      expect(carousel.prev_page_number.value).toBe(3)
    })

    test('next wraps to 1 when on the last page', () => {
      const { carousel } = makeCarousel({ card_count: 30 })
      carousel.setVisibleCapacity(10) // total_pages = 3
      carousel.nextPage()
      carousel.nextPage() // page = 2 (last)
      expect(carousel.next_page_number.value).toBe(1)
    })

    test('mid-range labels reflect 1-based neighbors', () => {
      const { carousel } = makeCarousel({ card_count: 30 })
      carousel.setVisibleCapacity(10)
      carousel.nextPage() // page = 1
      expect(carousel.prev_page_number.value).toBe(1)
      expect(carousel.next_page_number.value).toBe(3)
    })
  })

  // ── is_page_loading ──────────────────────────────────────────────────────

  describe('is_page_loading', () => {
    test('true when the target page lies beyond loaded cards and more remain', () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      const { carousel } = makeCarousel({ cards, hasNext: true, card_count: 100 })
      carousel.setVisibleCapacity(10)
      carousel.nextPage()
      expect(carousel.is_page_loading.value).toBe(true)
    })

    test('false when there are no more pages even if loaded < target', () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      const { carousel } = makeCarousel({ cards, hasNext: false, card_count: 5 })
      carousel.setVisibleCapacity(10)
      expect(carousel.is_page_loading.value).toBe(false)
    })
  })

  // ── auto-loader ──────────────────────────────────────────────────────────

  describe('auto-loader', () => {
    test('calls loadNextPage when target > loaded and the query can fetch', async () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      const { carousel, cards_query } = makeCarousel({
        cards,
        hasNext: true,
        card_count: 100
      })
      carousel.setVisibleCapacity(10)
      carousel.nextPage()
      await flushMicrotasks()
      expect(cards_query.loadNextPage).toHaveBeenCalled()
    })

    test('does not call loadNextPage while isLoading is true', async () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      const { carousel, cards_query } = makeCarousel({
        cards,
        hasNext: true,
        loading: true,
        card_count: 100
      })
      carousel.setVisibleCapacity(10)
      carousel.nextPage()
      await flushMicrotasks()
      expect(cards_query.loadNextPage).not.toHaveBeenCalled()
    })

    test('does not call loadNextPage when hasNextPage is false', async () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
      const { carousel, cards_query } = makeCarousel({
        cards,
        hasNext: false,
        card_count: 100
      })
      carousel.setVisibleCapacity(10)
      carousel.nextPage()
      await flushMicrotasks()
      expect(cards_query.loadNextPage).not.toHaveBeenCalled()
    })
  })
})

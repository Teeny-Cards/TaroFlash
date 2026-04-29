import { computed, ref, watch, type ComputedRef } from 'vue'
import { emitSfx } from '@/sfx/bus'
import type { useCardsInDeckInfiniteQuery } from '@/api/cards'
import type { VirtualCardList } from './virtual-card-list'

export type CardCarousel = ReturnType<typeof useCardCarousel>

type CardsQuery = ReturnType<typeof useCardsInDeckInfiniteQuery>

type Args = {
  list: Pick<VirtualCardList, 'all_cards'>
  cards_query: Pick<CardsQuery, 'hasNextPage' | 'isLoading' | 'loadNextPage'>
  card_count: ComputedRef<number>
}

/**
 * Carousel paging for the deck-editor card grid. Owns the reported visible
 * capacity, current page, page size, total pages, and the auto-load loop
 * that walks the infinite query forward until the current window is loaded.
 *
 * Capacity stays at 0 until the grid mounts and reports — first paint shows
 * a single card so the grid has a child to measure (see `visible_cards`).
 *
 * @example
 * const carousel = useCardCarousel({ list, cards_query, card_count })
 * carousel.setVisibleCapacity(8)
 */
export function useCardCarousel({ list, cards_query, card_count }: Args) {
  const visible_capacity = ref(0)
  const page = ref(0)

  // 'forward' = nextPage was last invoked (incoming from right);
  // 'backward' = prevPage. Drives the page-transition direction in the grid.
  const page_direction = ref<'forward' | 'backward'>('forward')

  const page_size = computed(() => Math.max(1, visible_capacity.value))
  const total_pages = computed(() => Math.max(1, Math.ceil(card_count.value / page_size.value)))
  const can_paginate = computed(() => total_pages.value > 1)

  // 1-based labels for "previous"/"next" buttons. Wrap so the prev label on
  // page 0 reads as the last page, and next on the last page reads as 1.
  const prev_page_number = computed(() => (page.value === 0 ? total_pages.value : page.value))
  const next_page_number = computed(() =>
    page.value === total_pages.value - 1 ? 1 : page.value + 2
  )

  const visible_cards = computed(() => {
    if (visible_capacity.value === 0) return list.all_cards.value.slice(0, 1)
    const start = page.value * page_size.value
    return list.all_cards.value.slice(start, start + page_size.value)
  })

  const is_page_loading = computed(() => {
    const start = page.value * page_size.value
    return start >= list.all_cards.value.length && cards_query.hasNextPage.value
  })

  /** Reported by the card-grid once it has measured its visible area. */
  function setVisibleCapacity(n: number) {
    visible_capacity.value = n
  }

  /** Step back one page; wraps from page 0 to the last page. */
  function prevPage() {
    if (!can_paginate.value) return
    page_direction.value = 'backward'
    page.value = (page.value - 1 + total_pages.value) % total_pages.value
    emitSfx('ui.slide_up')
  }

  /** Step forward one page; wraps from the last page back to page 0. */
  function nextPage() {
    if (!can_paginate.value) return
    page_direction.value = 'forward'
    page.value = (page.value + 1) % total_pages.value
    emitSfx('ui.slide_up')
  }

  /**
   * Jump directly to a 0-based page index. No-op when paging is disabled
   * or the target equals the current page; clamps out-of-range values.
   */
  function goToPage(n: number) {
    if (!can_paginate.value) return

    const target = Math.max(0, Math.min(total_pages.value - 1, n))
    if (target === page.value) return

    page_direction.value = target > page.value ? 'forward' : 'backward'
    page.value = target

    emitSfx('ui.slide_up')
  }

  watch(total_pages, (n) => {
    if (page.value > n - 1) page.value = Math.max(0, n - 1)
  })

  // Walk pages until the current carousel window is fully loaded. Tracks
  // page/page_size, loaded count, and the query flags as discrete sources
  // so each fetch's completion (length grew + isLoading flipped) re-fires
  // the handler and keeps loading until the target window is reached.
  watch(
    () => ({
      target: (page.value + 1) * page_size.value,
      loaded: list.all_cards.value.length,
      can_fetch: cards_query.hasNextPage.value && !cards_query.isLoading.value
    }),
    ({ target, loaded, can_fetch }) => {
      if (target > loaded && can_fetch) cards_query.loadNextPage()
    },
    { immediate: true }
  )

  return {
    page,
    page_size,
    page_direction,
    total_pages,
    visible_cards,
    is_page_loading,
    can_paginate,
    prev_page_number,
    next_page_number,
    setVisibleCapacity,
    prevPage,
    nextPage,
    goToPage
  }
}

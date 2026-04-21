import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref, computed } from 'vue'

const { useInfiniteScrollMock } = vi.hoisted(() => ({
  useInfiniteScrollMock: vi.fn()
}))

vi.mock('@/composables/use-infinite-scroll', () => ({
  useInfiniteScroll: useInfiniteScrollMock
}))

import CardGrid from '@/views/deck/card-grid/index.vue'

function makeCardsQuery({ has_next = false, is_loading = false, load = vi.fn() } = {}) {
  return {
    data: { value: { pages: [[]], pageParams: [0] } },
    hasNextPage: { value: has_next },
    isLoading: { value: is_loading },
    loadNextPage: load
  }
}

function makeEditor({
  cards = [],
  getKey = (c) => c.id,
  mode = ref('view'),
  isCardSelected = () => false
} = {}) {
  return {
    all_cards: computed(() => cards),
    mode,
    getKey,
    isCardSelected
  }
}

function mount(options = {}) {
  const editor = options.editor ?? makeEditor()
  const cardsQuery = options.cardsQuery ?? makeCardsQuery()
  return shallowMount(CardGrid, {
    global: {
      provide: {
        'card-editor': editor,
        'cards-query': cardsQuery,
        'card-attributes': { front: {}, back: {} }
      }
    }
  })
}

describe('CardGrid (card-grid/index.vue)', () => {
  // ── Sentinel rendering ─────────────────────────────────────────────────────

  test('omits the sentinel when there is no next page', () => {
    const wrapper = mount({ cardsQuery: makeCardsQuery({ has_next: false }) })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').exists()).toBe(false)
  })

  test('renders the sentinel when hasNextPage is true', () => {
    const wrapper = mount({ cardsQuery: makeCardsQuery({ has_next: true }) })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').exists()).toBe(true)
  })

  test('shows a loading indicator inside the sentinel while fetching the next page', () => {
    const wrapper = mount({
      cardsQuery: makeCardsQuery({ has_next: true, is_loading: true })
    })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').text()).toContain('Loading')
  })

  // ── useInfiniteScroll wiring ──────────────────────────────────────────────

  test('wires useInfiniteScroll on mount', () => {
    useInfiniteScrollMock.mockClear()
    mount()
    expect(useInfiniteScrollMock).toHaveBeenCalledOnce()
  })

  test('on_intersect callback delegates to cards_query.loadNextPage', () => {
    useInfiniteScrollMock.mockClear()
    const cardsQuery = makeCardsQuery({ has_next: true })
    mount({ cardsQuery })
    const [, on_intersect] = useInfiniteScrollMock.mock.calls[0]
    on_intersect()
    expect(cardsQuery.loadNextPage).toHaveBeenCalledOnce()
  })

  test('enabled getter is true only when hasNextPage AND not loading', () => {
    useInfiniteScrollMock.mockClear()
    const cardsQuery = makeCardsQuery({ has_next: true, is_loading: false })
    mount({ cardsQuery })
    const [, , options] = useInfiniteScrollMock.mock.calls[0]
    expect(options.enabled()).toBe(true)
    cardsQuery.isLoading.value = true
    expect(options.enabled()).toBe(false)
  })

  // ── Grid item rendering — getKey + isCardSelected ─────────────────────────

  test('renders one grid-item per card from all_cards', () => {
    const cards = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'GridItem' })).toHaveLength(3)
  })

  test('uses editor-supplied getKey() for v-for keys', () => {
    const cards = [{ id: 1 }, { id: 2 }]
    const getKey = vi.fn((c) => `gk-${c.id}`)
    mount({ editor: makeEditor({ cards, getKey }) })
    expect(getKey).toHaveBeenCalledWith(cards[0])
    expect(getKey).toHaveBeenCalledWith(cards[1])
  })

  test('forwards isCardSelected(card.id) as the selected prop on each grid-item', () => {
    const cards = [{ id: 1 }, { id: 2 }]
    const isCardSelected = vi.fn((id) => id === 1)
    const wrapper = mount({ editor: makeEditor({ cards, isCardSelected }) })
    const items = wrapper.findAllComponents({ name: 'GridItem' })
    expect(items[0].props('selected')).toBe(true)
    expect(items[1].props('selected')).toBe(false)
  })

  test('passes selected=false when card.id is undefined (defensive)', () => {
    const cards = [{ id: undefined }]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'GridItem' })[0].props('selected')).toBe(false)
  })

  // ── card-selected emit ─────────────────────────────────────────────────────

  test('re-emits card-selected upward with the card.id from the inner GridItem', async () => {
    const cards = [{ id: 7 }]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    const item = wrapper.findAllComponents({ name: 'GridItem' })[0]
    await item.vm.$emit('card-selected')
    expect(wrapper.emitted('card-selected')).toEqual([[7]])
  })
})

import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref, computed } from 'vue'

const { useInfiniteScrollMock } = vi.hoisted(() => ({
  useInfiniteScrollMock: vi.fn()
}))

vi.mock('@/composables/use-infinite-scroll', () => ({
  useInfiniteScroll: useInfiniteScrollMock
}))

import List from '@/views/deck/card-editor/list.vue'

function makeCardsQuery({ has_next = false, is_loading = false, load = vi.fn() } = {}) {
  return {
    data: { value: { pages: [[]], pageParams: [0] } },
    hasNextPage: { value: has_next },
    isLoading: { value: is_loading },
    loadNextPage: load
  }
}

function makeEditor({ cards = [], getKey = (c) => c.id } = {}) {
  return {
    all_cards: computed(() => cards),
    getKey
  }
}

function mount(options = {}) {
  const editor = options.editor ?? makeEditor()
  const cardsQuery = options.cardsQuery ?? makeCardsQuery()
  return shallowMount(List, {
    global: {
      provide: {
        'card-editor': editor,
        'cards-query': cardsQuery
      }
    }
  })
}

describe('CardList (list.vue)', () => {
  // ── Sentinel rendering — gated by hasNextPage ─────────────────────────────

  test('omits the sentinel when there is no next page (every row is loaded)', () => {
    const wrapper = mount({ cardsQuery: makeCardsQuery({ has_next: false }) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').exists()).toBe(false)
  })

  test('renders the sentinel when hasNextPage is true', () => {
    const wrapper = mount({ cardsQuery: makeCardsQuery({ has_next: true }) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').exists()).toBe(true)
  })

  test('shows a loading indicator inside the sentinel while fetching the next page', () => {
    const wrapper = mount({
      cardsQuery: makeCardsQuery({ has_next: true, is_loading: true })
    })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').text()).toContain('Loading')
  })

  test('hides the loading indicator when not actively fetching', () => {
    const wrapper = mount({
      cardsQuery: makeCardsQuery({ has_next: true, is_loading: false })
    })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').text()).not.toContain('Loading')
  })

  // ── useInfiniteScroll wiring ──────────────────────────────────────────────

  test('wires useInfiniteScroll on the sentinel ref with the query loader', () => {
    useInfiniteScrollMock.mockClear()
    mount()
    expect(useInfiniteScrollMock).toHaveBeenCalledOnce()
  })

  test('passes a getter for `enabled` that combines hasNextPage + !isLoading', () => {
    useInfiniteScrollMock.mockClear()
    const cardsQuery = makeCardsQuery({ has_next: true, is_loading: false })
    mount({ cardsQuery })
    const [, , options] = useInfiniteScrollMock.mock.calls[0]
    expect(typeof options.enabled).toBe('function')
    expect(options.enabled()).toBe(true)

    cardsQuery.isLoading.value = true
    expect(options.enabled()).toBe(false)

    cardsQuery.isLoading.value = false
    cardsQuery.hasNextPage.value = false
    expect(options.enabled()).toBe(false)
  })

  test('the on_intersect callback delegates to cards_query.loadNextPage', () => {
    useInfiniteScrollMock.mockClear()
    const cardsQuery = makeCardsQuery({ has_next: true })
    mount({ cardsQuery })
    const [, on_intersect] = useInfiniteScrollMock.mock.calls[0]
    on_intersect()
    expect(cardsQuery.loadNextPage).toHaveBeenCalledOnce()
  })

  // ── List item rendering — getKey + duplicate prop ─────────────────────────

  test('renders one list-item per card from all_cards', () => {
    const cards = [
      { id: 1, front_text: 'a' },
      { id: 2, front_text: 'b' }
    ]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'ListItem' })).toHaveLength(2)
  })

  test('uses the editor-supplied getKey() for each list-item v-for entry', () => {
    const cards = [
      { id: 1, front_text: 'a' },
      { id: 2, front_text: 'b' }
    ]
    const getKey = vi.fn((c) => `key-${c.id}`)
    mount({ editor: makeEditor({ cards, getKey }) })
    expect(getKey).toHaveBeenCalledWith(cards[0])
    expect(getKey).toHaveBeenCalledWith(cards[1])
  })

  test('forwards card.is_duplicate as the duplicate prop on each list-item', () => {
    const cards = [
      { id: 1, is_duplicate: true },
      { id: 2, is_duplicate: false }
    ]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    const items = wrapper.findAllComponents({ name: 'ListItem' })
    expect(items[0].props('duplicate')).toBe(true)
    expect(items[1].props('duplicate')).toBe(false)
  })

  test('defaults duplicate to false when card.is_duplicate is missing', () => {
    const cards = [{ id: 1 }]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'ListItem' })[0].props('duplicate')).toBe(false)
  })
})

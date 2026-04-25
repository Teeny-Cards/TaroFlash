import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref, computed } from 'vue'

import CardGrid from '@/views/deck/card-grid/index.vue'

function makeEditor({
  cards = [],
  is_selecting = ref(false),
  isCardSelected = () => false,
  hasNextPage = ref(false),
  isLoading = ref(false),
  observeSentinel = vi.fn(),
  card_attributes = { front: {}, back: {} }
} = {}) {
  return {
    all_cards: computed(() => cards.map((c, i) => ({ ...c, client_id: `cid-${c.id ?? i}` }))),
    is_selecting,
    isCardSelected,
    hasNextPage,
    isLoading,
    observeSentinel,
    card_attributes
  }
}

function mount(options = {}) {
  const editor = options.editor ?? makeEditor(options)
  return shallowMount(CardGrid, {
    global: {
      provide: {
        'card-editor': editor
      }
    }
  })
}

describe('CardGrid (card-grid/index.vue)', () => {
  // ── Sentinel rendering ─────────────────────────────────────────────────────

  test('omits the sentinel when there is no next page', () => {
    const wrapper = mount({ hasNextPage: ref(false) })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').exists()).toBe(false)
  })

  test('renders the sentinel when hasNextPage is true', () => {
    const wrapper = mount({ hasNextPage: ref(true) })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').exists()).toBe(true)
  })

  test('shows a loading indicator inside the sentinel while fetching the next page', () => {
    const wrapper = mount({ hasNextPage: ref(true), isLoading: ref(true) })
    expect(wrapper.find('[data-testid="card-grid__sentinel"]').text()).toContain('Loading')
  })

  // ── observeSentinel wiring ────────────────────────────────────────────────

  test('hands the sentinel ref to observeSentinel on mount', () => {
    const observeSentinel = vi.fn()
    mount({ observeSentinel })
    expect(observeSentinel).toHaveBeenCalledOnce()
  })

  // ── Grid item rendering — client_id + isCardSelected ─────────────────────

  test('renders one grid-item per card from all_cards', () => {
    const cards = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'GridItem' })).toHaveLength(3)
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

import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref, computed } from 'vue'

import List from '@/views/deck/card-editor/list.vue'

function makeEditor({
  cards = [],
  hasNextPage = ref(false),
  isLoading = ref(false),
  observeSentinel = vi.fn()
} = {}) {
  return {
    all_cards: computed(() => cards.map((c) => ({ ...c, client_id: `cid-${c.id}` }))),
    hasNextPage,
    isLoading,
    observeSentinel
  }
}

function mount(options = {}) {
  const editor = options.editor ?? makeEditor(options)
  return shallowMount(List, {
    global: {
      provide: {
        'card-editor': editor
      }
    }
  })
}

describe('CardList (list.vue)', () => {
  // ── Sentinel rendering — gated by hasNextPage ─────────────────────────────

  test('omits the sentinel when there is no next page (every row is loaded)', () => {
    const wrapper = mount({ hasNextPage: ref(false) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').exists()).toBe(false)
  })

  test('renders the sentinel when hasNextPage is true', () => {
    const wrapper = mount({ hasNextPage: ref(true) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').exists()).toBe(true)
  })

  test('shows a loading indicator inside the sentinel while fetching the next page', () => {
    const wrapper = mount({ hasNextPage: ref(true), isLoading: ref(true) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').text()).toContain('Loading')
  })

  test('hides the loading indicator when not actively fetching', () => {
    const wrapper = mount({ hasNextPage: ref(true), isLoading: ref(false) })
    expect(wrapper.find('[data-testid="card-list__sentinel"]').text()).not.toContain('Loading')
  })

  // ── observeSentinel wiring ────────────────────────────────────────────────

  test('hands the sentinel ref to observeSentinel on mount', () => {
    const observeSentinel = vi.fn()
    mount({ observeSentinel })
    expect(observeSentinel).toHaveBeenCalledOnce()
  })

  // ── List item rendering — client_id + duplicate prop ─────────────────────

  test('renders one list-item per card from all_cards', () => {
    const cards = [
      { id: 1, front_text: 'a' },
      { id: 2, front_text: 'b' }
    ]
    const wrapper = mount({ editor: makeEditor({ cards }) })
    expect(wrapper.findAllComponents({ name: 'ListItem' })).toHaveLength(2)
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

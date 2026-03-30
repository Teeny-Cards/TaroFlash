import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { expect, test, vi, beforeEach } from 'vite-plus/test'
import CardGrid from '@/views/deck/card-grid/index.vue'
import { card } from '@tests/mocks/models/card'

beforeEach(() => {
  vi.clearAllMocks()
})

function mountCardGrid(cards = [], mode = 'view') {
  return shallowMount(CardGrid, {
    global: {
      provide: {
        'card-editor': {
          all_cards: ref(cards),
          mode: ref(mode),
          selected_card_ids: ref([])
        }
      }
    }
  })
}

test('Renders the card grid container', () => {
  const wrapper = mountCardGrid()
  expect(wrapper.find('[data-testid="card-grid"]').exists()).toBe(true)
})

test('Renders a grid item per card', () => {
  const cards = card.many(3)
  const wrapper = mountCardGrid(cards)
  expect(wrapper.findAll('grid-item-stub').length).toBe(3)
})

test('Renders no grid items when cards array is empty', () => {
  const wrapper = mountCardGrid([])
  expect(wrapper.findAll('grid-item-stub').length).toBe(0)
})

test('Emits card-selected when a grid item emits card-selected', async () => {
  const cards = card.many(2)
  const wrapper = mountCardGrid(cards)

  await wrapper.find('grid-item-stub').trigger('card-selected')

  expect(wrapper.emitted('card-selected')).toBeTruthy()
})

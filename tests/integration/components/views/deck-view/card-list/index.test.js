import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { expect, test, vi, beforeEach } from 'vite-plus/test'
import CardEditor from '@/views/deck/card-editor/index.vue'
import { card } from '@tests/mocks/models/card'

vi.mock('@/sfx/bus', () => ({
  emitSfx: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function mountCardEditor(cards = [], addCard = vi.fn()) {
  return shallowMount(CardEditor, {
    global: {
      provide: {
        'card-editor': {
          all_cards: ref(cards),
          addCard,
          isDuplicate: () => false
        }
      }
    }
  })
}

test('renders empty state when there are no cards', () => {
  const wrapper = mountCardEditor([])

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-list__empty-state"]').exists()).toBe(true)
})

test('does not render empty state when there are cards', () => {
  const cards = card.many(3)
  const wrapper = mountCardEditor(cards)

  expect(wrapper.find('[data-testid="card-list__empty-state"]').exists()).toBe(false)
})

test('calls addCard when add button in empty state is clicked', async () => {
  const addCard = vi.fn()
  const wrapper = mountCardEditor([], addCard)

  // With shallowMount, UiButton is stubbed — trigger click on the stub
  await wrapper.find('[data-testid="card-list__empty-state"] ui-button-stub').trigger('click')

  expect(addCard).toHaveBeenCalled()
})

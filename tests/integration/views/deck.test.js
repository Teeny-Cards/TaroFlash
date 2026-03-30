import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vite-plus/test'
import { createTestingPinia } from '@pinia/testing'
import DeckView from '@/views/deck/deck-view.vue'
import { deck } from '@tests/mocks/models/deck'

const mocks = vi.hoisted(() => ({
  fetchDeck: vi.fn(),
  moveCardsToDeck: vi.fn(),
  deleteCards: vi.fn(),
  warnMock: vi.fn()
}))

vi.mock('@/api/decks', () => ({
  fetchDeck: mocks.fetchDeck
}))

vi.mock('@/api/cards', () => ({
  moveCardsToDeck: mocks.moveCardsToDeck,
  deleteCards: mocks.deleteCards,
  updateCards: vi.fn()
}))

vi.mock('@/composables/alert', () => ({
  useAlert: vi.fn(() => ({
    warn: mocks.warnMock
  }))
}))

vi.mock('@/composables/modal', () => ({
  useModal: vi.fn(() => ({
    open: vi.fn().mockReturnValue({ response: Promise.resolve(null) })
  }))
}))

vi.mock('@/sfx/bus', () => ({
  emitSfx: vi.fn()
}))

vi.mock('@/composables/use-media-query', () => ({
  useMediaQuery: vi.fn(() => ref(true))
}))

import { ref } from 'vue'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.warnMock.mockResolvedValue(true)
  mocks.fetchDeck.mockResolvedValue(deck.one({ traits: 'with_cards' }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function createDeckView(deckData = null) {
  const deckInstance = deckData ?? deck.one({ traits: 'with_cards' })
  mocks.fetchDeck.mockResolvedValue(deckInstance)

  const wrapper = mount(DeckView, {
    props: { id: String(deckInstance.id) },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.vm.$nextTick()
  await new Promise((resolve) => setTimeout(resolve, 10))
  await wrapper.vm.$nextTick()

  return wrapper
}

describe('Viewing a Deck', () => {
  it('renders the deck view container', async () => {
    const wrapper = await createDeckView()
    expect(wrapper.find('[data-testid="deck-view"]').exists()).toBe(true)
  })

  it('fetches deck data on mount', async () => {
    await createDeckView()
    expect(mocks.fetchDeck).toHaveBeenCalled()
  })

  it('shows overview panel after deck is loaded', async () => {
    const wrapper = await createDeckView()
    expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(true)
  })
})

describe('Navigation and Persistence', () => {
  it('persists tab preference using localStorage', async () => {
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    }
    vi.stubGlobal('localStorage', localStorageMock)

    await createDeckView()

    expect(localStorageMock.getItem).toHaveBeenCalled()
  })
})

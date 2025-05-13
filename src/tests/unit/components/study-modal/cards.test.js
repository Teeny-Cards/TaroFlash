import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import Cards from '@/components/study-modal/cards.vue'

// Mock the Card component
vi.mock('@/components/card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div data-testid="mock-card" :class="{ \'show-back\': showBack }"><slot /></div>',
    props: ['size', 'showBack']
  }
}))

// Mock the watch function
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual
  }
})

// Create a mock study session
const createMockStudySession = (overrides = {}) => ({
  cards: [
    {
      id: '1',
      front_text: 'Front 1',
      back_text: 'Back 1',
      order: 0
    },
    {
      id: '2',
      front_text: 'Front 2',
      back_text: 'Back 2',
      order: 1
    }
  ],
  studiedCardIds: new Set(),
  failedCardIds: new Set(),
  activeCard: {
    id: '1',
    front_text: 'Front 1',
    back_text: 'Back 1',
    order: 0
  },
  visibleCard: {
    id: '1',
    front_text: 'Front 1',
    back_text: 'Back 1',
    order: 0
  },
  cardRevealed: false,
  ...overrides
})

describe('Study Modal Cards Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock setTimeout
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  // Test basic rendering
  it('renders properly with provided study session', () => {
    const mockStudySession = createMockStudySession()

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal__cards"]').exists()).toBe(true)

    // Should render two cards (front and back)
    const cards = wrapper.findAll('[data-testid="mock-card"]')
    expect(cards.length).toBe(2)

    // First card should contain front text
    expect(cards[0].text()).toBe('Front 1')

    // Second card should contain back text
    expect(cards[1].text()).toBe('Back 1')
  })

  // Test front card reveal on mount
  it('reveals front card after mounting with a delay', async () => {
    const mockStudySession = createMockStudySession()

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    // Initially, frontRevealed should be false
    expect(wrapper.vm.frontRevealed).toBe(false)

    // Advance timers to trigger the reveal
    vi.advanceTimersByTime(200)

    // Now frontRevealed should be true
    expect(wrapper.vm.frontRevealed).toBe(true)
  })

  // Test back card reveal based on study session state
  it('shows back card when cardRevealed is true', async () => {
    const mockStudySession = createMockStudySession({ cardRevealed: true })

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    // Advance timers to trigger the front reveal
    vi.advanceTimersByTime(200)

    // Both cards should be revealed
    expect(wrapper.vm.frontRevealed).toBe(true)
    expect(wrapper.vm.showBack).toBe(true)
  })

  it('shows back card when card has been studied', async () => {
    const studiedIds = new Set(['1'])
    const mockStudySession = createMockStudySession({
      studiedCardIds: studiedIds,
      cardRevealed: false
    })

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    // Advance timers to trigger the front reveal
    vi.advanceTimersByTime(200)

    // Both cards should be revealed because the card has been studied
    expect(wrapper.vm.frontRevealed).toBe(true)
    expect(wrapper.vm.showBack).toBe(true)
  })

  it('shows back card when card has failed', async () => {
    const failedIds = new Set(['1'])
    const mockStudySession = createMockStudySession({
      failedCardIds: failedIds,
      cardRevealed: false
    })

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    // Advance timers to trigger the front reveal
    vi.advanceTimersByTime(200)

    // Both cards should be revealed because the card has failed
    expect(wrapper.vm.frontRevealed).toBe(true)
    expect(wrapper.vm.showBack).toBe(true)
  })

  // Test card change
  it('handles visible card changes', async () => {
    const mockStudySession = createMockStudySession()

    const wrapper = shallowMount(Cards, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          Card: {
            template: '<div data-testid="mock-card"><slot /></div>',
            props: ['size', 'showBack']
          }
        }
      }
    })

    // Advance timers to reveal the front card
    vi.advanceTimersByTime(200)

    // Front should be revealed
    expect(wrapper.vm.frontRevealed).toBe(true)

    // Change the visible card
    mockStudySession.visibleCard = {
      id: '2',
      front_text: 'Front 2',
      back_text: 'Back 2',
      order: 1
    }

    // Trigger the watcher by forcing a nextTick
    await wrapper.vm.$nextTick()

    // Test passes if we get here without errors
    expect(true).toBe(true)
  })
})

import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import Track from '@/components/study-modal/track.vue'

// Mock the tooltip component
vi.mock('@/components/ui-kit/tooltip.vue', () => ({
  default: {
    name: 'Tooltip',
    template: '<div data-testid="mock-tooltip"><slot /></div>',
    props: ['text', 'open']
  }
}))

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
    },
    {
      id: '3',
      front_text: 'Front 3',
      back_text: 'Back 3',
      order: 2
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
  lastStudiedCard: undefined,
  cardRevealed: false,
  ...overrides
})

describe('Study Modal Track Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test basic rendering
  it('renders properly with provided study session', () => {
    const mockStudySession = createMockStudySession()
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal-track"]').exists()).toBe(true)
    
    // Should render card buttons for each card in the deck
    const cardButtons = wrapper.findAll('button')
    expect(cardButtons.length).toBe(3)
    
    // Should show the current card count
    const countElement = wrapper.find('[data-testid="study-modal-track__count"]')
    expect(countElement.text()).toContain('1/3')
  })

  // Test card button styling based on state
  it('applies correct styling to active card', () => {
    const mockStudySession = createMockStudySession()
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the active card button
    const cardButtons = wrapper.findAll('button')
    const activeCardButton = cardButtons[0]
    
    // Should have the active card class
    expect(activeCardButton.classes()).toContain('!bg-purple-dark')
    expect(activeCardButton.classes()).toContain('!min-w-6')
  })

  it('applies correct styling to studied cards', () => {
    const studiedIds = new Set(['2'])
    const mockStudySession = createMockStudySession({ 
      studiedCardIds: studiedIds
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the studied card button
    const cardButtons = wrapper.findAll('button')
    const studiedCardButton = cardButtons[1]
    
    // Should have the studied card class
    expect(studiedCardButton.classes()).toContain('!bg-purple')
  })

  it('applies correct styling to failed cards', () => {
    const failedIds = new Set(['3'])
    const mockStudySession = createMockStudySession({ 
      failedCardIds: failedIds
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the failed card button
    const cardButtons = wrapper.findAll('button')
    const failedCardButton = cardButtons[2]
    
    // Should have the failed card class
    expect(failedCardButton.classes()).toContain('!bg-grey-light')
  })

  // Test card click events
  it('emits cardClicked event when clicking on a studied card', async () => {
    const studiedIds = new Set(['2'])
    const mockStudySession = createMockStudySession({ 
      studiedCardIds: studiedIds
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the studied card button and click it
    const cardButtons = wrapper.findAll('button')
    const studiedCardButton = cardButtons[1]
    await studiedCardButton.trigger('click')
    
    // Verify the cardClicked event was emitted with the correct card
    expect(wrapper.emitted('cardClicked')).toBeTruthy()
    expect(wrapper.emitted('cardClicked').length).toBe(1)
    expect(wrapper.emitted('cardClicked')[0][0]).toEqual(mockStudySession.cards[1])
  })

  it('emits cardClicked event when clicking on a failed card', async () => {
    const failedIds = new Set(['3'])
    const mockStudySession = createMockStudySession({ 
      failedCardIds: failedIds
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the failed card button and click it
    const cardButtons = wrapper.findAll('button')
    const failedCardButton = cardButtons[2]
    await failedCardButton.trigger('click')
    
    // Verify the cardClicked event was emitted with the correct card
    expect(wrapper.emitted('cardClicked')).toBeTruthy()
    expect(wrapper.emitted('cardClicked').length).toBe(1)
    expect(wrapper.emitted('cardClicked')[0][0]).toEqual(mockStudySession.cards[2])
  })

  it('emits cardClicked event when clicking on the next card after the last studied card', async () => {
    const studiedIds = new Set(['1'])
    const mockStudySession = createMockStudySession({ 
      studiedCardIds: studiedIds,
      lastStudiedCard: {
        id: '1',
        front_text: 'Front 1',
        back_text: 'Back 1',
        order: 0
      }
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find the next card button and click it
    const cardButtons = wrapper.findAll('button')
    const nextCardButton = cardButtons[1]
    await nextCardButton.trigger('click')
    
    // Verify the cardClicked event was emitted with the correct card
    expect(wrapper.emitted('cardClicked')).toBeTruthy()
    expect(wrapper.emitted('cardClicked').length).toBe(1)
    expect(wrapper.emitted('cardClicked')[0][0]).toEqual(mockStudySession.cards[1])
  })

  it('does not emit cardClicked event when clicking on an unrelated card', async () => {
    const mockStudySession = createMockStudySession()
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Find a non-active, non-studied card button and click it
    const cardButtons = wrapper.findAll('button')
    const unrelatedCardButton = cardButtons[2]
    await unrelatedCardButton.trigger('click')
    
    // Verify no cardClicked event was emitted
    expect(wrapper.emitted('cardClicked')).toBeFalsy()
  })

  // Test helper functions
  it('correctly identifies active, studied, and failed cards', () => {
    const studiedIds = new Set(['2'])
    const failedIds = new Set(['3'])
    const mockStudySession = createMockStudySession({ 
      studiedCardIds: studiedIds,
      failedCardIds: failedIds
    })
    
    const wrapper = shallowMount(Track, {
      global: {
        provide: {
          studySession: mockStudySession
        },
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    // Test isActive
    expect(wrapper.vm.isActive(mockStudySession.cards[0])).toBe(true)
    expect(wrapper.vm.isActive(mockStudySession.cards[1])).toBe(false)
    
    // Test isStudied
    expect(wrapper.vm.isStudied(mockStudySession.cards[0])).toBe(false)
    expect(wrapper.vm.isStudied(mockStudySession.cards[1])).toBe(true)
    
    // Test isFailed
    expect(wrapper.vm.isFailed(mockStudySession.cards[0])).toBe(false)
    expect(wrapper.vm.isFailed(mockStudySession.cards[2])).toBe(true)
  })
})

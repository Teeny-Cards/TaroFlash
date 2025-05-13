import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import Buttons from '@/components/study-modal/buttons.vue'

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

describe('Study Modal Buttons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test rendering in initial state (card not revealed)
  it('renders Show button when card is not revealed', () => {
    const mockStudySession = createMockStudySession()
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal__buttons"]').exists()).toBe(true)
    
    // Should show the "Show" button
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(1)
    expect(buttons[0].text()).toBe('Show!')
    
    // Should not show the "Got It" and "Nope" buttons
    expect(wrapper.text()).not.toContain('Got It!')
    expect(wrapper.text()).not.toContain('Nope!')
  })

  // Test rendering when card is revealed
  it('renders Got It and Nope buttons when card is revealed', () => {
    const mockStudySession = createMockStudySession({ cardRevealed: true })
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    // Should show the "Got It" and "Nope" buttons
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('Got It!')
    expect(buttons[1].text()).toBe('Nope!')
    
    // Should not show the "Show" button
    expect(wrapper.text()).not.toContain('Show!')
  })

  // Test rendering when card has been studied
  it('renders disabled Got It and Nope buttons when card has been studied', () => {
    const studiedIds = new Set(['1'])
    const mockStudySession = createMockStudySession({ 
      studiedCardIds: studiedIds,
      cardRevealed: true
    })
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    // Should show the "Got It" and "Nope" buttons
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    
    // Buttons should be disabled
    expect(buttons[0].attributes('disabled')).toBe('')
    expect(buttons[1].attributes('disabled')).toBe('')
    
    // Buttons should have opacity class
    expect(buttons[0].classes()).toContain('opacity-50')
    expect(buttons[1].classes()).toContain('opacity-50')
  })

  // Test button click events
  it('emits reveal event when Show button is clicked', async () => {
    const mockStudySession = createMockStudySession()
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    // Find the Show button and click it
    const showButton = wrapper.find('button')
    await showButton.trigger('click')
    
    // Verify the reveal event was emitted
    expect(wrapper.emitted('reveal')).toBeTruthy()
    expect(wrapper.emitted('reveal').length).toBe(1)
  })

  it('emits correct event when Got It button is clicked', async () => {
    const mockStudySession = createMockStudySession({ cardRevealed: true })
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    // Find the Got It button and click it
    const gotItButton = wrapper.findAll('button')[0]
    await gotItButton.trigger('click')
    
    // Verify the correct event was emitted
    expect(wrapper.emitted('correct')).toBeTruthy()
    expect(wrapper.emitted('correct').length).toBe(1)
  })

  it('emits incorrect event when Nope button is clicked', async () => {
    const mockStudySession = createMockStudySession({ cardRevealed: true })
    
    const wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })

    // Find the Nope button and click it
    const nopeButton = wrapper.findAll('button')[1]
    await nopeButton.trigger('click')
    
    // Verify the incorrect event was emitted
    expect(wrapper.emitted('incorrect')).toBeTruthy()
    expect(wrapper.emitted('incorrect').length).toBe(1)
  })

  // Test computed properties
  it('computes cardRevealed correctly based on study session', () => {
    // Case 1: cardRevealed is true in study session
    let mockStudySession = createMockStudySession({ cardRevealed: true })
    
    let wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })
    
    expect(wrapper.vm.cardRevealed).toBe(true)
    
    // Case 2: card has been studied
    mockStudySession = createMockStudySession({ 
      studiedCardIds: new Set(['1']),
      cardRevealed: false
    })
    
    wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })
    
    expect(wrapper.vm.cardRevealed).toBe(true)
    
    // Case 3: neither condition is true
    mockStudySession = createMockStudySession()
    
    wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })
    
    expect(wrapper.vm.cardRevealed).toBe(false)
  })

  it('computes disabled correctly based on study session', () => {
    // Case 1: card has been studied
    let mockStudySession = createMockStudySession({ 
      studiedCardIds: new Set(['1'])
    })
    
    let wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })
    
    expect(wrapper.vm.disabled).toBe(true)
    
    // Case 2: card has not been studied
    mockStudySession = createMockStudySession()
    
    wrapper = shallowMount(Buttons, {
      global: {
        provide: {
          studySession: mockStudySession
        }
      }
    })
    
    expect(wrapper.vm.disabled).toBe(false)
  })
})

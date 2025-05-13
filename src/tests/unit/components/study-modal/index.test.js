import { mount, shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import StudyModal from '@/components/study-modal/index.vue'


// Create mock deck and cards
const createMockDeck = (overrides = {}) => ({
  id: '1',
  title: 'Test Deck',
  description: 'Test Description',
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
  ...overrides
})

describe('Study Modal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Test basic rendering
  it('renders properly when open', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': {
            template: '<div><slot /></div>',
            props: ['open'],
            emits: ['close', 'opened']
          },
          'ui-kit:button': {
            template: '<button><slot /></button>',
            props: ['icon-left', 'variant', 'inverted', 'icon-only'],
            emits: ['click']
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal__header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal__body"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Studying Test Deck')
  })

  it('does not render body content when closed', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: false,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': {
            template: '<div><slot /></div>',
            props: ['open'],
            emits: ['close', 'opened']
          },
          'ui-kit:button': {
            template: '<button><slot /></button>',
            props: ['icon-left', 'variant', 'inverted', 'icon-only'],
            emits: ['click']
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="study-modal__body"]').exists()).toBe(false)
  })

  // Test child components
  it('renders child components when open', () => {
    const wrapper = mount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': {
            template: '<div><slot /></div>',
            props: ['open'],
            emits: ['close', 'opened']
          },
          'ui-kit:button': {
            template: '<button><slot /></button>',
            props: ['icon-left', 'variant', 'inverted', 'icon-only'],
            emits: ['click']
          }
        }
      }
    })

    expect(wrapper.findComponent({ name: 'Cards' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Buttons' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Track' }).exists()).toBe(true)
  })

  // Test setup study session
  it('has a setupStudySession method', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': true,
          'ui-kit:button': true,
          'Cards': true,
          'Buttons': true,
          'Track': true
        }
      }
    })

    // Verify the setupStudySession method exists
    expect(typeof wrapper.vm.setupStudySession).toBe('function')
  })

  // Test card navigation
  it('has a method to mark cards as correct', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': true,
          'ui-kit:button': true,
          'Cards': true,
          'Buttons': true,
          'Track': true
        }
      }
    })

    // Verify the onCorrect method exists
    expect(typeof wrapper.vm.onCorrect).toBe('function')
  })

  it('has a method to mark cards as incorrect', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': true,
          'ui-kit:button': true,
          'Cards': true,
          'Buttons': true,
          'Track': true
        }
      }
    })

    // Verify the onIncorrect method exists
    expect(typeof wrapper.vm.onIncorrect).toBe('function')
  })

  // Test close button
  it('emits closed event when close button is clicked', async () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': {
            template: '<div><slot /></div>',
            props: ['open'],
            emits: ['close', 'opened']
          },
          'ui-kit:button': {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            props: ['icon-left', 'variant', 'inverted', 'icon-only'],
            emits: ['click']
          }
        }
      }
    })

    // Find the close button and click it
    const closeButton = wrapper.find('[data-testid="study-modal__actions"] button')
    await closeButton.trigger('click')

    // Verify the closed event was emitted
    expect(wrapper.emitted('closed')).toBeTruthy()
  })

  // Test card clicking from track
  it('has a method to handle card clicks from track', () => {
    const wrapper = shallowMount(StudyModal, {
      props: {
        open: true,
        deck: createMockDeck()
      },
      global: {
        stubs: {
          'ui-kit:modal': true,
          'ui-kit:button': true,
          'Cards': true,
          'Buttons': true,
          'Track': true
        }
      }
    })

    // Verify the onCardClicked method exists
    expect(typeof wrapper.vm.onCardClicked).toBe('function')
  })
})

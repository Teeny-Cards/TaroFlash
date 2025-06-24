import { shallowMount } from '@vue/test-utils'
import { expect, it, vi, beforeEach, afterEach } from 'vitest'
import ButtonMenu from '@/components/ui-kit/button-menu.vue'

// Mock document event listeners
beforeEach(() => {
  vi.spyOn(document, 'addEventListener').mockImplementation(() => {})
  vi.spyOn(document, 'removeEventListener').mockImplementation(() => {})
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Test basic rendering
it('renders properly with default props', () => {
  const wrapper = shallowMount(ButtonMenu, {
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.attributes('teeny-dropdown')).toBe('')
})

// Test trigger label
it('renders trigger label correctly', () => {
  const triggerLabel = 'Open Menu'
  const wrapper = shallowMount(ButtonMenu, {
    props: {
      triggerLabel
    },
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  expect(wrapper.find('button').text()).toBe(triggerLabel)
})

// Test dropdown visibility
it('has a toggleDropdown method', () => {
  const wrapper = shallowMount(ButtonMenu, {
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  // Check that the toggleDropdown method exists
  expect(typeof wrapper.vm.toggleDropdown).toBe('function')
})

// Test actions rendering
it('renders actions correctly', async () => {
  const actions = [
    {
      label: 'Action 1',
      action: vi.fn(),
      variant: 'interaction'
    },
    {
      label: 'Action 2',
      action: vi.fn(),
      variant: 'muted'
    }
  ]

  const wrapper = shallowMount(ButtonMenu, {
    props: {
      actions
    },
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  // Open dropdown
  const mockEvent = { stopPropagation: vi.fn() }
  await wrapper.vm.toggleDropdown(mockEvent)

  // Should render action buttons
  const actionButtons = wrapper.findAll('[teeny-dropdown__action]')
  expect(actionButtons.length).toBe(2)
  expect(actionButtons[0].text()).toBe('Action 1')
  expect(actionButtons[1].text()).toBe('Action 2')
})

// Test action click
it('calls action function when action is clicked', async () => {
  const actionFn = vi.fn()
  const actions = [
    {
      label: 'Action 1',
      action: actionFn,
      variant: 'interaction'
    }
  ]

  const wrapper = shallowMount(ButtonMenu, {
    props: {
      actions
    },
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  // Open dropdown
  const mockEvent = { stopPropagation: vi.fn() }
  await wrapper.vm.toggleDropdown(mockEvent)

  // Click action
  await wrapper.vm.onOptionClick(actions[0])

  // Action should be called
  expect(actionFn).toHaveBeenCalled()

  // Dropdown should be closed
  expect(wrapper.find('.absolute').exists()).toBe(false)
})

// Test animation functions
it('has animation functions', () => {
  const wrapper = shallowMount(ButtonMenu)

  // Check that the animation functions exist
  expect(typeof wrapper.vm.animateActionsIn).toBe('function')
  expect(typeof wrapper.vm.animateActionsOut).toBe('function')
})

// Test document event listeners
it('adds document click listener on mount', () => {
  shallowMount(ButtonMenu, {
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
})

it('removes document click listener on unmount', () => {
  const wrapper = shallowMount(ButtonMenu, {
    global: {
      stubs: {
        'ui-kit:button': {
          template: '<button><slot /></button>',
          props: ['variant', 'inverted', 'iconLeft', 'iconRight', 'iconOnly', 'size']
        }
      }
    }
  })

  wrapper.unmount()

  expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
})

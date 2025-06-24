import { shallowMount } from '@vue/test-utils'
import { expect, it, vi, beforeEach, afterEach } from 'vitest'
import Modal from '@/components/ui-kit/modal.vue'

// Mock body-scroll-lock
vi.mock('body-scroll-lock', () => ({
  disableBodyScroll: vi.fn(),
  enableBodyScroll: vi.fn()
}))

// Import the mocked functions for type checking only
// eslint-disable-next-line no-unused-vars
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// Test basic rendering
it('renders properly when open', () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: true
    },
    slots: {
      default: '<div>Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="ui-kit-modal"]').exists()).toBe(true)
  expect(wrapper.html()).toContain('<div>Modal Content</div>')
})

it('does not render when closed', () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: false
    },
    slots: {
      default: '<div>Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="ui-kit-modal"]').exists()).toBe(false)
})

// Test backdrop
it('renders backdrop when backdrop prop is true', () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: true,
      backdrop: true
    },
    slots: {
      default: '<div>Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  expect(wrapper.find('.bg-black\\/25').exists()).toBe(true)
})

it('does not render backdrop when backdrop prop is false', () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: true,
      backdrop: false
    },
    slots: {
      default: '<div>Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  expect(wrapper.find('.bg-black\\/25').exists()).toBe(false)
})

it('emits close event when clicking backdrop', async () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: true
    },
    slots: {
      default: '<div>Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  const backdrop = wrapper.find('[data-testid="ui-kit-modal-backdrop"]')
  await backdrop.trigger('click')

  expect(wrapper.emitted('closed')).toBeTruthy()
})

it('does not emit close event when clicking inside', async () => {
  const wrapper = shallowMount(Modal, {
    props: {
      open: true
    },
    slots: {
      default: '<div id="inner-content">Modal Content</div>'
    },
    global: {
      stubs: ['teleport']
    }
  })

  // Create a click event on a child element
  const event = new MouseEvent('click', {
    bubbles: true
  })

  // Mock the target to be a child element, not the modal itself
  Object.defineProperty(event, 'target', {
    value: document.createElement('div')
  })

  // Dispatch the event on the modal
  const modalElement = wrapper.find('[data-testid="ui-kit-modal"]')
  modalElement.element.dispatchEvent(event)

  // Should not emit close event
  expect(wrapper.emitted('close')).toBeFalsy()
})

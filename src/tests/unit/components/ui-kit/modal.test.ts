import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import Modal from '@/components/ui-kit/modal.vue'

// Mock body-scroll-lock
vi.mock('body-scroll-lock', () => ({
  disableBodyScroll: vi.fn(),
  enableBodyScroll: vi.fn()
}))

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

describe('UI Kit Modal', () => {
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
    expect(wrapper.find('[ui-kit-modal]').exists()).toBe(true)
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
    expect(wrapper.find('[ui-kit-modal]').exists()).toBe(false)
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

  // Test scroll locking
  it('disables body scroll when opened', async () => {
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

    // Open the modal
    await wrapper.setProps({ open: true })

    // Wait for nextTick to be called in the watch handler
    await vi.runOnlyPendingTimersAsync()

    // Should disable body scroll
    expect(disableBodyScroll).toHaveBeenCalled()
  })

  it('enables body scroll when closed', async () => {
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

    // Close the modal
    await wrapper.setProps({ open: false })

    // Should enable body scroll
    expect(enableBodyScroll).toHaveBeenCalled()
  })

  it('enables body scroll on unmount', () => {
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

    // Unmount the component
    wrapper.unmount()

    // Should enable body scroll
    expect(enableBodyScroll).toHaveBeenCalled()
  })

  // Test click outside to close
  it('emits close event when clicking outside', async () => {
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

    // Create a mock event with target that has ui-kit-modal attribute
    const mockTarget = document.createElement('div')
    mockTarget.setAttribute('ui-kit-modal', '')
    const mockEvent = {
      target: mockTarget
    }

    // Call close method
    await wrapper.vm.close(mockEvent)

    // Should emit close event
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close event when clicking inside', async () => {
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

    // Create a mock event with target that does not have ui-kit-modal attribute
    const mockTarget = document.createElement('div')
    const mockEvent = {
      target: mockTarget
    }

    // Call close method
    await wrapper.vm.close(mockEvent)

    // Should not emit close event
    expect(wrapper.emitted('close')).toBeFalsy()
  })
})

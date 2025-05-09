import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import Alert from '@/components/ui-kit/alert.vue'

describe('UI Kit Alert', () => {
  // Mock document methods
  beforeEach(() => {
    // Mock document.documentElement.scrollTop
    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      value: 0
    })

    // Mock document.body.style
    Object.defineProperty(document.body, 'style', {
      writable: true,
      value: {
        position: '',
        top: '',
        width: ''
      }
    })

    // Mock window.scrollTo
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Test basic rendering
  it('renders properly when open', () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[ui-kit-alert]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Message')
  })

  it('does not render when closed', () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: false,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[ui-kit-alert]').exists()).toBe(false)
  })

  // Test slots
  it('renders slot content', () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      slots: {
        default: '<button>Close</button>'
      },
      global: {
        stubs: ['teleport']
      }
    })

    expect(wrapper.html()).toContain('<button>Close</button>')
  })

  // Test scroll locking
  it('locks scroll when opened', async () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: false,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    // Set initial scroll position
    document.documentElement.scrollTop = 100

    // Open the alert
    await wrapper.setProps({ open: true })

    // Should lock scroll
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-100px')
    expect(document.body.style.width).toBe('100%')
  })

  it('releases scroll when closed', async () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    // Set initial scroll position
    document.documentElement.scrollTop = 100
    wrapper.vm.scrollTop = 100

    // Close the alert
    await wrapper.setProps({ open: false })

    // Should release scroll
    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')
    expect(document.body.style.width).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 100)
  })

  it('releases scroll on unmount', () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    // Unmount the component
    wrapper.unmount()

    // Should release scroll
    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')
    expect(document.body.style.width).toBe('')
  })

  // Test click outside to close
  it('emits close event when clicking outside', async () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    // Create a mock event with target that has ui-kit-alert attribute
    const mockTarget = document.createElement('div')
    mockTarget.setAttribute('ui-kit-alert', '')
    const mockEvent = {
      target: mockTarget
    }

    // Call close method
    await wrapper.vm.close(mockEvent)

    // Should emit close event
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close event when clicking inside', async () => {
    const wrapper = shallowMount(Alert, {
      props: {
        open: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: ['teleport']
      }
    })

    // Create a mock event with target that does not have ui-kit-alert attribute
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

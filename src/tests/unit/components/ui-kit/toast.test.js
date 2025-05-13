import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import Toast from '@/components/ui-kit/toast.vue'

describe('UI Kit Toast', () => {
  // Mock timers
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  // Test basic rendering
  it('renders properly with required props', () => {
    const toast = {
      message: 'Test message',
      state: 'info',
      delay: 3000,
      persist: false
    }

    const wrapper = mount(Toast, {
      props: {
        toast
      },
      global: {
        stubs: ['transition']
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})

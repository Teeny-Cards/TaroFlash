import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import Dropdown from '@/components/ui-kit/dropdown.vue'

describe('UI Kit Dropdown', () => {
  // Mock document event listeners
  beforeEach(() => {
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {})
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {})
  })
  
  // Test basic rendering
  it('renders properly with default state', () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.attributes('teeny-dropdown')).toBe('')
    
    // Dropdown should be closed by default
    expect(wrapper.find('.absolute').exists()).toBe(false)
  })
  
  // Test slots
  it('renders trigger slot content', () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    expect(wrapper.html()).toContain('<button>Toggle</button>')
  })
  
  it('renders dropdown slot content when open', async () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    // Initially closed
    expect(wrapper.find('.absolute').exists()).toBe(false)
    
    // Open the dropdown
    await wrapper.vm.toggle()
    
    // Should now be open
    expect(wrapper.find('.absolute').exists()).toBe(true)
    expect(wrapper.html()).toContain('<div>Dropdown Content</div>')
  })
  
  // Test toggle functionality
  it('toggles dropdown visibility when toggle method is called', async () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    // Initially closed
    expect(wrapper.find('.absolute').exists()).toBe(false)
    
    // Open the dropdown
    await wrapper.vm.toggle()
    
    // Should now be open
    expect(wrapper.find('.absolute').exists()).toBe(true)
    
    // Close the dropdown
    await wrapper.vm.toggle()
    
    // Should now be closed again
    expect(wrapper.find('.absolute').exists()).toBe(false)
  })
  
  // Test click outside behavior
  it('adds document click listener when opened', async () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    // Open the dropdown
    await wrapper.vm.toggle()
    
    // Should add event listener
    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })
  
  it('closes dropdown when close method is called', async () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    // Open the dropdown
    await wrapper.vm.toggle()
    
    // Should be open
    expect(wrapper.find('.absolute').exists()).toBe(true)
    
    // Create a mock event
    const mockEvent = {
      target: document.createElement('div')
    }
    
    // Call close method
    await wrapper.vm.close(mockEvent)
    
    // Should now be closed
    expect(wrapper.find('.absolute').exists()).toBe(false)
    
    // Should remove event listener
    expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })
  
  it('does not close dropdown when clicking on dropdown element', async () => {
    const wrapper = shallowMount(Dropdown, {
      slots: {
        trigger: '<button>Toggle</button>',
        dropdown: '<div>Dropdown Content</div>'
      }
    })
    
    // Open the dropdown
    await wrapper.vm.toggle()
    
    // Create a mock event with target that has teeny-dropdown attribute
    const mockTarget = document.createElement('div')
    mockTarget.setAttribute('teeny-dropdown', '')
    const mockEvent = {
      target: mockTarget
    }
    
    // Call close method
    await wrapper.vm.close(mockEvent)
    
    // Should still be open
    expect(wrapper.find('.absolute').exists()).toBe(true)
  })
})

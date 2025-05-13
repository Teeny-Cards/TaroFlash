import { shallowMount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import Button from '@/components/ui-kit/button.vue'

// Global component configuration
const globalConfig = {
  global: {
    stubs: {
      'ui-kit:icon': {
        template: '<div class="icon-stub" :data-size="size" :data-src="src"></div>',
        props: ['size', 'src']
      }
    }
  }
}

describe('UI Kit Button', () => {
  // Test basic rendering
  it('renders properly with default props', () => {
    const wrapper = shallowMount(Button, globalConfig)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ui-kit-btn')
    expect(wrapper.classes()).toContain('btn-interaction') // default variant
    expect(wrapper.classes()).toContain('btn-base') // default size
  })

  // Test slot content
  it('renders slot content correctly', () => {
    const slotContent = 'Click Me'
    const wrapper = shallowMount(Button, {
      ...globalConfig,
      slots: {
        default: slotContent
      }
    })
    expect(wrapper.text()).toContain(slotContent)
  })

  // Test variants
  describe('variants', () => {
    it('applies interaction variant class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          variant: 'interaction'
        }
      })
      expect(wrapper.classes()).toContain('btn-interaction')
    })

    it('applies muted variant class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          variant: 'muted'
        }
      })
      expect(wrapper.classes()).toContain('btn-muted')
    })

    it('applies danger variant class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          variant: 'danger'
        }
      })
      expect(wrapper.classes()).toContain('btn-danger')
    })
  })

  // Test sizes
  describe('sizes', () => {
    it('applies large size class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          size: 'large'
        }
      })
      expect(wrapper.classes()).toContain('btn-large')
    })

    it('applies base size class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          size: 'base'
        }
      })
      expect(wrapper.classes()).toContain('btn-base')
    })

    it('applies small size class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          size: 'small'
        }
      })
      expect(wrapper.classes()).toContain('btn-small')
    })

    it('applies xs size class', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          size: 'xs'
        }
      })
      expect(wrapper.classes()).toContain('btn-xs')
    })
  })

  // Test boolean props
  describe('boolean props', () => {
    it('applies inverted class when inverted prop is true', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          inverted: true
        }
      })
      expect(wrapper.classes()).toContain('btn-inverted')
    })

    it('applies icon-only class when iconOnly prop is true', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          iconOnly: true
        }
      })
      expect(wrapper.classes()).toContain('btn-icon-only')
    })

    it('applies fancy-hover class when fancyHover prop is true', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          fancyHover: true
        }
      })
      expect(wrapper.classes()).toContain('btn-fancy-hover')
    })
  })

  // Test icons
  describe('icons', () => {
    it('renders left icon when iconLeft prop is provided', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          iconLeft: 'test-icon'
        }
      })

      const leftIconContainer = wrapper.find('[uikit-button__icon-left]')
      expect(leftIconContainer.exists()).toBe(true)
    })

    it('renders right icon when iconRight prop is provided', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          iconRight: 'test-icon'
        }
      })

      const rightIconContainer = wrapper.find('[uikit-button__icon-right]')
      expect(rightIconContainer.exists()).toBe(true)
    })

    it('does not render icon containers when no icon props are provided', () => {
      const wrapper = shallowMount(Button, globalConfig)

      const leftIconContainer = wrapper.find('[uikit-button__icon-left]')
      const rightIconContainer = wrapper.find('[uikit-button__icon-right]')

      expect(leftIconContainer.exists()).toBe(false)
      expect(rightIconContainer.exists()).toBe(false)
    })

    it('passes correct icon size based on button size', () => {
      const wrapper = shallowMount(Button, {
        ...globalConfig,
        props: {
          size: 'large',
          iconLeft: 'test-icon'
        }
      })

      const iconStub = wrapper.find('.icon-stub')
      expect(iconStub.attributes('data-size')).toBe('large')
    })
  })

  // Test click event
  it('emits click event when clicked', async () => {
    const wrapper = shallowMount(Button, globalConfig)
    await wrapper.find('button').trigger('click')

    // The component should emit a click event
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})

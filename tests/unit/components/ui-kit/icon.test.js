import { shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import Icon from '@/components/ui-kit/icon.vue'

// Mock the async component import
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    defineAsyncComponent: vi.fn((loader) => {
      return {
        name: 'MockedSvgIcon',
        template: '<div class="mocked-svg-icon"></div>'
      }
    })
  }
})

// Test basic rendering
it('renders properly with required props', () => {
  const wrapper = shallowMount(Icon, {
    props: {
      src: 'add'
    }
  })
  expect(wrapper.exists()).toBe(true)
})

// Test size classes
describe('sizes', () => {
  it('applies default size class when no size is provided', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        src: 'add'
      }
    })

    // The default size is 'base'
    expect(wrapper.attributes('class')).toContain('w-5 h-5')
  })

  it('applies large size class', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        src: 'add',
        size: 'large'
      }
    })

    expect(wrapper.attributes('class')).toContain('w-8  h-8')
  })

  it('applies base size class', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        src: 'add',
        size: 'base'
      }
    })

    expect(wrapper.attributes('class')).toContain('w-5 h-5')
  })

  it('applies small size class', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        src: 'add',
        size: 'small'
      }
    })

    expect(wrapper.attributes('class')).toContain('w-4 h-4')
  })

  it('applies xs size class', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        src: 'add',
        size: 'xs'
      }
    })

    expect(wrapper.attributes('class')).toContain('w-3 h-3')
  })
})

// Test prop validation
it('validates size prop values', () => {
  const validator = Icon.props.size.validator

  expect(validator('large')).toBe(true)
  expect(validator('base')).toBe(true)
  expect(validator('small')).toBe(true)
  expect(validator('xs')).toBe(true)
  expect(validator('invalid')).toBe(false)
})

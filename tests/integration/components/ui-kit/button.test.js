import { mount, shallowMount } from '@vue/test-utils'
import { expect, describe, it } from 'vite-plus/test'
import Button from '@/components/ui-kit/button.vue'

it('renders properly with default props', () => {
  const wrapper = mount(Button)
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.classes()).toContain('ui-kit-btn')
  expect(wrapper.classes()).toContain('ui-kit-btn--solid') // default variant
  expect(wrapper.classes()).toContain('ui-kit-btn--base') // default size
})

it('renders slot content correctly', () => {
  const slotContent = 'Click Me'
  const wrapper = mount(Button, {
    slots: {
      default: slotContent
    }
  })
  expect(wrapper.text()).toContain(slotContent)
})

describe('variants', () => {
  it('applies solid variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'solid'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--solid')
  })

  it('applies outline variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'outline'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--outline')
  })
})

describe('sizes', () => {
  it('applies large size class', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'lg'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--lg')
  })

  it('applies base size class', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'base'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--base')
  })

  it('applies small size class', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'sm'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--sm')
  })

  it('applies xs size class', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'xs'
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--xs')
  })
})

describe('boolean props', () => {
  it('applies inverted class when inverted prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        inverted: true
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--inverted')
  })

  it('applies icon-only class when iconOnly prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        iconOnly: true
      }
    })
    expect(wrapper.classes()).toContain('ui-kit-btn--icon-only')
  })
})

describe('icons', () => {
  it('renders left icon when iconLeft prop is provided', () => {
    const wrapper = shallowMount(Button, {
      props: {
        iconLeft: 'add'
      }
    })
    expect(wrapper.find('.btn-icon--left').exists()).toBe(true)
  })

  it('renders right icon when iconRight prop is provided', () => {
    const wrapper = shallowMount(Button, {
      props: {
        iconRight: 'add'
      }
    })
    expect(wrapper.find('.btn-icon--right').exists()).toBe(true)
  })

  it('does not render icon elements when no icon props are provided', () => {
    const wrapper = shallowMount(Button)
    expect(wrapper.find('.btn-icon--left').exists()).toBe(false)
    expect(wrapper.find('.btn-icon--right').exists()).toBe(false)
  })
})

it('emits click event when clicked', async () => {
  const wrapper = mount(Button)
  await wrapper.trigger('click')
  expect(wrapper.emitted()).toHaveProperty('click')
})

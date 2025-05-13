import { shallowMount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import Input from '@/components/ui-kit/input.vue'

describe('UI Kit Input', () => {
  // Test basic rendering
  it('renders properly with default props', () => {
    const wrapper = shallowMount(Input)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('teeny-input')
    expect(wrapper.classes()).toContain('input-base') // default size
    
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })
  
  // Test type prop
  it('applies type attribute correctly', () => {
    const wrapper = shallowMount(Input, {
      props: {
        type: 'password'
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })
  
  // Test placeholder prop
  it('applies placeholder attribute correctly', () => {
    const placeholder = 'Enter your name'
    const wrapper = shallowMount(Input, {
      props: {
        placeholder
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe(placeholder)
  })
  
  // Test center prop
  it('applies text-center class when center prop is true', () => {
    const wrapper = shallowMount(Input, {
      props: {
        center: true
      }
    })
    
    const input = wrapper.find('input')
    expect(input.classes()).toContain('text-center')
  })
  
  // Test size classes
  describe('sizes', () => {
    it('applies large size class', () => {
      const wrapper = shallowMount(Input, {
        props: {
          size: 'large'
        }
      })
      
      expect(wrapper.classes()).toContain('input-large')
    })
    
    it('applies base size class', () => {
      const wrapper = shallowMount(Input, {
        props: {
          size: 'base'
        }
      })
      
      expect(wrapper.classes()).toContain('input-base')
    })
  })
  
  // Test v-model binding
  it('updates value when input changes', async () => {
    const wrapper = shallowMount(Input)
    const input = wrapper.find('input')
    
    await input.setValue('test value')
    
    // Check that the v-model is updated
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })
  
  // Test prop validation
  it('validates size prop values', () => {
    const validator = Input.props.size.validator
    
    expect(validator('large')).toBe(true)
    expect(validator('base')).toBe(true)
    expect(validator('invalid')).toBe(false)
  })
})

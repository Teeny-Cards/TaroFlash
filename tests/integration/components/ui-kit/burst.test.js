import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiBurst from '@/components/ui-kit/burst.vue'

function mountBurst(props = {}) {
  return shallowMount(UiBurst, { props })
}

describe('UiBurst', () => {
  test('renders a burst root', () => {
    const wrapper = mountBurst()
    expect(wrapper.find('[data-testid="ui-kit-burst"]').exists()).toBe(true)
  })

  test('renders 8 spokes by default', () => {
    const wrapper = mountBurst()
    expect(wrapper.findAll('.spoke')).toHaveLength(8)
  })

  test('applies the size modifier class', () => {
    const wrapper = mountBurst({ size: 'lg' })
    expect(wrapper.classes()).toContain('burst--lg')
  })

  test('defaults to base size when no size prop is passed', () => {
    const wrapper = mountBurst()
    expect(wrapper.classes()).toContain('burst--base')
  })

  test('sets --burst-dur from the duration prop', () => {
    const wrapper = mountBurst({ duration: 420 })
    expect(wrapper.attributes('style')).toContain('--burst-dur: 420ms')
  })

  test('sets --burst-dot-size from the width prop when provided', () => {
    const wrapper = mountBurst({ width: 4 })
    expect(wrapper.attributes('style')).toContain('--burst-dot-size: 4px')
  })

  test('omits --burst-dot-size when width is not provided', () => {
    const wrapper = mountBurst()
    expect(wrapper.attributes('style') ?? '').not.toContain('--burst-dot-size')
  })

  test('emits done on animationend', async () => {
    const wrapper = mountBurst()
    await wrapper.find('[data-testid="ui-kit-burst"]').trigger('animationend')
    expect(wrapper.emitted('done')).toBeTruthy()
  })
})

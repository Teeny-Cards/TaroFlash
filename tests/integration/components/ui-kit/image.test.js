import { shallowMount, flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import Image from '@/components/ui-kit/image.vue'

vi.mock('@/assets/images/binder-clip.svg', () => ({
  default: '/mocked/binder-clip.svg'
}))

vi.mock('@/assets/images/highlighter.svg', () => ({
  default: '/mocked/highlighter.svg'
}))

it('renders properly with required src prop', () => {
  const wrapper = shallowMount(Image, {
    props: {
      src: 'binder-clip'
    }
  })

  expect(wrapper.exists()).toBe(true)
})

it('does not render img element before image loads', async () => {
  const wrapper = shallowMount(Image, {
    props: {
      src: 'binder-clip'
    }
  })

  expect(wrapper.find('img').exists()).toBe(false)
})

it('renders img element with correct attributes after image loads', async () => {
  const testSrc = 'binder-clip'
  const wrapper = shallowMount(Image, {
    props: {
      src: testSrc
    }
  })

  await flushPromises()

  const img = wrapper.find('img')
  expect(img.exists()).toBe(true)
  expect(img.attributes('alt')).toBe(testSrc)
  expect(img.attributes('src')).toBe('/mocked/binder-clip.svg')
  expect(img.classes()).toContain('h-full')
  expect(img.classes()).toContain('w-full')
})

it('handles error when image is not found', async () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  const wrapper = shallowMount(Image, {
    props: {
      src: 'non-existent-image'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('img').exists()).toBe(false)

  consoleSpy.mockRestore()
})

import { shallowMount, flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import Image from '@/components/ui-kit/image.vue'

const { mockedConsoleWarn } = vi.hoisted(() => {
  vi.resetModules()

  return {
    mockedConsoleWarn: vi.fn()
  }
})

vi.mock('@/assets/images/binder-clip.svg', () => ({
  default: '/mocked/binder-clip.svg'
}))

vi.mock('@/assets/images/highlighter.svg', () => ({
  default: '/mocked/highlighter.svg'
}))

vi.mock('@/composables/use-logger', () => {
  return {
    useLogger: vi.fn(() => ({ warn: mockedConsoleWarn }))
  }
})

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

it('warns when image is not found', async () => {
  const testSrc = 'non-existent-image'
  shallowMount(Image, {
    props: {
      src: testSrc
    }
  })

  await flushPromises()

  expect(mockedConsoleWarn).toHaveBeenCalledWith(`No image found for: ${testSrc}`)
})

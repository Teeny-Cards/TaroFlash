import { shallowMount, flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vite-plus/test'
import Image from '@/components/ui-kit/image.vue'

const { mockedWarn } = vi.hoisted(() => {
  vi.resetModules()

  return {
    mockedWarn: vi.fn()
  }
})

vi.mock('@/utils/logger', () => ({
  default: { warn: mockedWarn }
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

it('warns when image is not found', async () => {
  const testSrc = 'non-existent-image'
  shallowMount(Image, {
    props: {
      src: testSrc
    }
  })

  await flushPromises()

  expect(mockedWarn).toHaveBeenCalledWith(`No image found for: ${testSrc}`)
})

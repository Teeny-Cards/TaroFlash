import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import Card from '@/components/card/index.vue'
import { mockAndSimulateFileUpload } from '../../mocks/file-upload.js'

async function setContentEditableText(el, text) {
  el.textContent = text
  const evt = new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text })

  el.dispatchEvent(evt)
  await new Promise((resolve) => setTimeout(resolve, 10))
}

it('renders front face by default', () => {
  const wrapper = mount(Card)
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)
})

it('renders back face when revealed', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').exists()).toBe(true)
})

it('shows front text when provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').text()).toBe('Test')
})

it('shows back text when provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').text()).toBe('Test')
})

it('shows front image when provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_image_url: 'https://via.placeholder.com/150'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"][data-image="true"]').exists()).toBe(true)
})

it('shows back image when provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_image_url: 'https://via.placeholder.com/150'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"][data-image="true"]').exists()).toBe(true)
})

it('renders front image and text when both provided', () => {
  const wrapper = mount(Card, {
    props: {
      front_image_url: 'https://via.placeholder.com/150',
      front_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"][data-image="true"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__front"]').text()).toBe('Test')
})

it('renders back image and text when both provided', () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_image_url: 'https://via.placeholder.com/150',
      back_text: 'Test'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"][data-image="true"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="card-face__back"]').text()).toBe('Test')
})

it('emits update:front_text event when front text is updated', async () => {
  const wrapper = mount(Card, {
    props: {
      front_text: 'Test',
      mode: 'edit'
    }
  })

  const el = wrapper.find('[data-testid="card-face__text-input"]').element
  await setContentEditableText(el, 'Updated')

  expect(wrapper.emitted('update:front_text')).toBeTruthy()
})

it('emits update:back_text event when back text is updated', async () => {
  const wrapper = mount(Card, {
    props: {
      side: 'back',
      back_text: 'Test',
      mode: 'edit'
    }
  })
  const el = wrapper.find('[data-testid="card-face__text-input"]').element
  await setContentEditableText(el, 'Updated')

  expect(wrapper.emitted('update:back_text')).toBeTruthy()
})

it('emits image-uploaded event when image is uploaded', async () => {
  const wrapper = mount(Card, {
    props: {
      mode: 'edit'
    }
  })

  const { file } = await mockAndSimulateFileUpload(
    wrapper,
    '[data-testid="card-face__front"] input[type="file"]'
  )

  expect(wrapper.emitted('image-uploaded')).toBeTruthy()
  expect(wrapper.emitted('image-uploaded')[0][0]).toEqual({
    preview: 'data:image/jpeg;base64,mockbase64data',
    file
  })
})

it('emits image-uploaded event when back image is uploaded', async () => {
  const wrapper = mount(Card, {
    props: {
      mode: 'edit',
      side: 'back'
    }
  })

  const { file } = await mockAndSimulateFileUpload(
    wrapper,
    '[data-testid="card-face__back"] input[type="file"]',
    {
      fileName: 'test-image.png',
      fileType: 'image/png',
      previewResult: 'data:image/png;base64,mockbase64data'
    }
  )

  expect(wrapper.emitted('image-uploaded')).toBeTruthy()
  expect(wrapper.emitted('image-uploaded')[0][0]).toEqual({
    preview: 'data:image/png;base64,mockbase64data',
    file
  })
})

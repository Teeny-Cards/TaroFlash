import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vitest'
import GridItem from '@/components/views/deck-view/card-grid/grid-item.vue'
import { card } from '@tests/mocks/models/card'
import { mockAndSimulateFileUpload } from '@tests/mocks/file-upload.js'

const mocks = vi.hoisted(() => ({
  play: vi.fn()
}))

vi.mock('@/composables/use-audio', () => ({
  useAudio: () => {
    return {
      play: mocks.play
    }
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('Renders base Card with passed props', () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'view',
      side: 'front'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="card"]').exists()).toBe(true)
})

test('Focus-in sequence (when not already active)', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front'
    }
  })

  await wrapper.find('[data-testid="card-face__text-input"]').trigger('focusin')

  expect(wrapper.emitted('card-activated')).toBeTruthy()
  expect(mocks.play).toHaveBeenCalledWith('slide_up')
})

test('Focus-in no-op when already active', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front',
      activeCardIndex: 0
    }
  })

  await wrapper.find('[data-testid="card-face__text-input"]').trigger('focusin')

  expect(wrapper.emitted('card-activated')).toBeFalsy()
  expect(mocks.play).not.toHaveBeenCalled()
})

test('Focus-out sequence (when currently active)', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front',
      activeCardIndex: 0
    }
  })

  wrapper.find('[data-testid="card-face__text-input"]').trigger('focusout')
  wrapper.setProps({ activeCardIndex: undefined })

  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(wrapper.emitted('card-deactivated')).toBeTruthy()
  expect(mocks.play).toHaveBeenCalledWith('card_drop')
})

test('Focus-out is ignored when not active', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front'
    }
  })

  wrapper.find('[data-testid="card-face__text-input"]').trigger('focusout')

  expect(wrapper.emitted('card-deactivated')).toBeFalsy()
  expect(mocks.play).not.toHaveBeenCalled()
})

test('Double-click in edit mode does nothing', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front'
    }
  })

  await wrapper.find('[data-testid="card"]').trigger('dblclick')

  expect(wrapper.emitted('card-activated')).toBeFalsy()
})

test('Double-click in select mode does nothing', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'select',
      side: 'front'
    }
  })

  await wrapper.find('[data-testid="card"]').trigger('dblclick')

  expect(wrapper.emitted('card-activated')).toBeFalsy()
})

test('Double-click in "view" mode emits "card-activated" with index', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'view',
      side: 'front'
    }
  })

  await wrapper.find('[data-testid="card"]').trigger('dblclick')

  expect(wrapper.emitted('card-activated')).toBeTruthy()
  expect(wrapper.emitted('card-activated')[0]).toEqual([0])
})

test('Image upload (front) updates front_image_preview and emits "card-image-updated" with file', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'front'
    }
  })

  const { file } = await mockAndSimulateFileUpload(
    wrapper,
    '[data-testid="card-face__front"] input[type="file"]'
  )

  expect(wrapper.emitted('card-image-updated')).toBeTruthy()
  expect(wrapper.emitted('card-image-updated')[0][0]).toBe(file)
})

test('Image upload (back) updates back_image_preview and emits "card-image-updated" with file', async () => {
  const card = card.one()
  const wrapper = mount(GridItem, {
    props: {
      card,
      index: 0,
      mode: 'edit',
      side: 'back'
    }
  })

  console.log(wrapper.html())
  const { file } = await mockAndSimulateFileUpload(
    wrapper,
    '[data-testid="card-face__back"] input[type="file"]'
  )

  expect(wrapper.emitted('card-image-updated')).toBeTruthy()
  expect(wrapper.emitted('card-image-updated')[0][0]).toBe(file)
})

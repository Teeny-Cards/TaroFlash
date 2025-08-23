import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vitest'
import CardGrid from '@/components/views/deck-view/card-grid/index.vue'
import { CardBuilder } from '@tests/mocks/models/card'
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

test('Renders a grid item per card', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'view',
      side: 'front'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.findAll('[data-testid="card"]').length).toBe(3)
})

test('Default side is "front" when omitted', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'view'
    }
  })

  expect(wrapper.find('[data-testid="card-face__front"]').exists()).toBe(true)
})

test('Passes "side" prop to child grid items', () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'view',
      side: 'back'
    }
  })

  expect(wrapper.find('[data-testid="card-face__back"]').exists()).toBe(true)
})

test('Mouseenter SFX: calls audio.play("click_04") only when mode==="edit" AND activeCardIndex!==index', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'edit',
      side: 'front'
    }
  })

  await wrapper.find('[data-testid="card"]').trigger('mouseenter')

  expect(mocks.play).toHaveBeenCalledWith('click_04')
})

test('Emits card-updated event when child grid-item emits card-updated', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'edit',
      side: 'front',
      activeCardIndex: 0
    }
  })

  await wrapper.find('[data-testid="card-face__text-input"]').setValue('test')

  expect(wrapper.emitted('card-updated')).toBeTruthy()
})

test('Emits card-image-updated event when child grid-item emits card-image-updated', async () => {
  const cards = CardBuilder().many(3)
  const wrapper = mount(CardGrid, {
    props: {
      cards,
      mode: 'edit',
      side: 'front',
      activeCardIndex: 0
    }
  })

  const { file } = await mockAndSimulateFileUpload(
    wrapper,
    '[data-testid="card-face__front"] input[type="file"]'
  )

  expect(wrapper.emitted('card-image-updated')).toBeTruthy()
})

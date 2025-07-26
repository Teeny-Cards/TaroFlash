import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import DeckSettings from '@/components/modals/deck-settings/index.vue'
import { DeckBuilder } from '@tests/mocks/models/deck'
import { createTestingPinia } from '@pinia/testing'

const mocks = vi.hoisted(() => {
  return {
    deleteDeck: vi.fn(),
    saveDeck: vi.fn(),
    uploadImage: vi.fn(),
    removeImage: vi.fn(),
    warn: vi.fn(() => ({
      response: Promise.resolve(true)
    }))
  }
})

vi.mock('@/composables/use-deck', () => ({
  useDeck: vi.fn(() => ({
    settings: {
      title: 'Test Deck',
      description: 'Test Description',
      is_public: true
    },
    image_url: undefined,
    saveDeck: mocks.saveDeck,
    deleteDeck: mocks.deleteDeck,
    uploadImage: mocks.uploadImage,
    removeImage: mocks.removeImage
  }))
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

vi.mock('@/composables/use-alert', () => ({
  useAlert: vi.fn(() => ({
    warn: mocks.warn
  }))
}))

it('Renders Cancel, Delete, and Save buttons when a deck exists', async () => {
  const wrapper = mount(DeckSettings, {
    props: {
      deck: DeckBuilder().one(),
      close: vi.fn()
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="deck-settings__actions"]').exists()).toBe(true)
  expect(wrapper.findAll('[data-testid="deck-settings__actions"] button').length).toBe(3)
})

it('Renders Cancel and Create buttons when a deck does not exist', async () => {
  const wrapper = mount(DeckSettings, {
    props: {
      close: vi.fn()
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="deck-settings__actions"]').exists()).toBe(true)
  expect(wrapper.findAll('[data-testid="deck-settings__actions"] button').length).toBe(2)
})

it('Calls close function when Cancel button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(DeckSettings, {
    props: {
      close
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:first-child').trigger('click')

  expect(close).toHaveBeenCalledWith(false)
})

it('Calls close function when Save button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(DeckSettings, {
    props: {
      close
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:last-child').trigger('click')

  expect(close).toHaveBeenCalledWith(true)
})

it('Calls close function when Delete button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(DeckSettings, {
    props: {
      deck: DeckBuilder().one(),
      close
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:nth-child(2)').trigger('click')

  expect(close).toHaveBeenCalledWith(true)
})

it('Calls deleteDeck function when Delete button is clicked', async () => {
  const wrapper = mount(DeckSettings, {
    props: {
      deck: DeckBuilder().one(),
      close: vi.fn()
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:nth-child(2)').trigger('click')

  expect(mocks.deleteDeck).toHaveBeenCalled()
})

it('Calls saveDeck function when Save button is clicked', async () => {
  const wrapper = mount(DeckSettings, {
    props: {
      deck: DeckBuilder().one(),
      close: vi.fn()
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:last-child').trigger('click')

  expect(mocks.saveDeck).toHaveBeenCalled()
})

it('Calls uploadImage function when image is uploaded', async () => {
  const wrapper = mount(DeckSettings, {
    props: {
      deck: DeckBuilder().one(),
      close: vi.fn()
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  await wrapper.find('[data-testid="deck-settings__actions"] button:last-child').trigger('click')

  expect(mocks.saveDeck).toHaveBeenCalled()
})

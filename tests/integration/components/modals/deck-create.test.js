import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const { mockEditor, mockRouterPush, mockRandomCover } = vi.hoisted(() => ({
  mockEditor: {
    saveDeck: vi.fn().mockResolvedValue({ id: 99 })
  },
  mockRouterPush: vi.fn(),
  mockRandomCover: vi.fn(() => ({ theme: 'pink-400', pattern: 'wave', icon: 'book' }))
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush })
}))

vi.mock('@/utils/cover', async () => {
  const actual = await vi.importActual('@/utils/cover')
  return { ...actual, randomCoverConfig: mockRandomCover }
})

vi.mock('@/composables/deck-editor', async () => {
  const { reactive } = await import('vue')
  return {
    useDeckEditor: vi.fn((deck) => ({
      settings: reactive({}),
      cover: reactive(deck?.cover_config ?? {}),
      card_attributes: reactive({ front: {}, back: {} }),
      saveDeck: (...args) => mockEditor.saveDeck(...args)
    })),
    deckEditorKey: Symbol('deckEditor')
  }
})

vi.mock('@/components/deck/deck-design-preview.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'DeckPreview',
      props: ['cover'],
      setup(props) {
        return () =>
          h('div', {
            'data-testid': 'deck-preview-stub',
            'data-theme': props.cover?.theme ?? ''
          })
      }
    })
  }
})

vi.mock('@/components/deck/cover-designer/index.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'CoverDesigner',
      props: ['config'],
      setup() {
        return () => h('div', { 'data-testid': 'cover-designer-stub' })
      }
    })
  }
})

vi.mock('@/components/layout-kit/modal/mobile-sheet.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'MobileSheet',
      emits: ['close'],
      setup(_p, { slots, emit }) {
        return () =>
          h('div', { 'data-testid': 'mobile-sheet-stub' }, [
            h('button', {
              'data-testid': 'mobile-sheet-stub__close',
              onClick: () => emit('close')
            }),
            slots.default?.()
          ])
      }
    })
  }
})

import DeckCreate from '@/components/modals/deck-create/index.vue'

function mountModal(close = vi.fn()) {
  const wrapper = mount(DeckCreate, { props: { close } })
  return { wrapper, close }
}

describe('DeckCreate modal', () => {
  beforeEach(() => {
    mockEditor.saveDeck.mockReset()
    mockEditor.saveDeck.mockResolvedValue({ id: 99 })
    mockRouterPush.mockClear()
    mockRandomCover.mockClear()
  })

  test('renders the preview, cover-designer, both action buttons, and the inputs', () => {
    const { wrapper } = mountModal()

    expect(wrapper.find('[data-testid="deck-create__body"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="deck-create__preview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="cover-designer-stub"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="deck-create__actions"] button')).toHaveLength(2)
  })

  test('seeds the editor cover with randomCoverConfig() values', () => {
    const { wrapper } = mountModal()
    expect(mockRandomCover).toHaveBeenCalledTimes(1)
    // Cover seeded from random helper flows into the preview stub's data-theme attr.
    expect(wrapper.find('[data-testid="deck-create__preview"]').attributes('data-theme')).toBe(
      'pink-400'
    )
  })

  test('cancel button closes with false', async () => {
    const { wrapper, close } = mountModal()
    const buttons = wrapper.findAll('[data-testid="deck-create__actions"] button')
    await buttons[0].trigger('click')

    expect(close).toHaveBeenCalledWith(false)
    expect(mockEditor.saveDeck).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  test('mobile-sheet @close also closes with false', async () => {
    const { wrapper, close } = mountModal()
    await wrapper.find('[data-testid="mobile-sheet-stub__close"]').trigger('click')

    expect(close).toHaveBeenCalledWith(false)
  })

  test('submit calls saveDeck, then close(true), then routes to the new deck', async () => {
    mockEditor.saveDeck.mockResolvedValueOnce({ id: 7 })
    const { wrapper, close } = mountModal()

    const buttons = wrapper.findAll('[data-testid="deck-create__actions"] button')
    await buttons[1].trigger('click')
    await flushPromises()

    expect(mockEditor.saveDeck).toHaveBeenCalled()
    expect(close).toHaveBeenCalledWith(true)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'deck', params: { id: 7 } })
  })

  test('submit does not close or route when saveDeck returns null', async () => {
    mockEditor.saveDeck.mockResolvedValueOnce(null)
    const { wrapper, close } = mountModal()

    const buttons = wrapper.findAll('[data-testid="deck-create__actions"] button')
    await buttons[1].trigger('click')
    await flushPromises()

    expect(close).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })
})

import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

// Stub Card so its default + editor slots render — otherwise ImageButton
// (which lives inside the card's default slot) is unreachable under shallowMount.
// Forward attrs so `data-testid="front-input"` / `back-input` make it through.
import { useAttrs } from 'vue'
const CardStub = defineComponent({
  name: 'Card',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', attrs, [slots.default?.(), slots.editor?.()])
  }
})

const mocks = vi.hoisted(() => ({
  setCardImageMock: vi.fn(),
  deleteCardImageMock: vi.fn(),
  updateCardMock: vi.fn(),
  emitSfxMock: vi.fn()
}))

vi.mock('@/api/cards', () => ({
  useSetCardImageMutation: () => ({
    mutate: mocks.setCardImageMock,
    mutateAsync: mocks.setCardImageMock
  }),
  useDeleteCardImageMutation: () => ({
    mutate: mocks.deleteCardImageMock,
    mutateAsync: mocks.deleteCardImageMock
  })
}))

vi.mock('@/sfx/bus', () => ({ emitSfx: mocks.emitSfxMock }))

vi.mock('@/composables/toast', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn(), warn: vi.fn() })
}))

import ListItemCard from '@/views/deck/card-editor/list-item-card.vue'
import ImageButton from '@/views/deck/image-button.vue'

function mount(props = {}) {
  return shallowMount(ListItemCard, {
    props: {
      duplicate: false,
      ...props,
      card: {
        id: 1,
        deck_id: 10,
        front_text: 'Q',
        back_text: 'A',
        rank: 1000,
        ...props.card
      }
    },
    global: {
      stubs: { Card: CardStub },
      provide: {
        'card-editor': {
          mode: ref('edit'),
          updateCard: mocks.updateCardMock,
          card_attributes: { front: {}, back: {} }
        }
      }
    }
  })
}

beforeEach(() => {
  mocks.setCardImageMock.mockReset()
  mocks.setCardImageMock.mockResolvedValue(undefined)
  mocks.deleteCardImageMock.mockReset()
  mocks.deleteCardImageMock.mockResolvedValue(undefined)
  mocks.updateCardMock.mockReset()
  mocks.emitSfxMock.mockReset()
})

describe('ListItemCard', () => {
  // ── Image buttons visibility (the temp-id fix) ─────────────────────────────

  test('renders image buttons on both sides when the card has a real id', () => {
    const wrapper = mount({ card: { id: 42 } })
    const buttons = wrapper.findAllComponents(ImageButton)
    expect(buttons).toHaveLength(2)
  })

  test('hides image buttons on both sides when the card has a temp id (id < 0)', () => {
    const wrapper = mount({ card: { id: -1 } })
    const buttons = wrapper.findAllComponents(ImageButton)
    expect(buttons).toHaveLength(0)
  })

  test('hides image buttons when id is 0 (not yet assigned)', () => {
    const wrapper = mount({ card: { id: 0 } })
    const buttons = wrapper.findAllComponents(ImageButton)
    expect(buttons).toHaveLength(0)
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  test('renders a front and a back card', () => {
    const wrapper = mount()
    expect(wrapper.find('[data-testid="front-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="back-input"]').exists()).toBe(true)
  })

  // ── Image upload / delete wiring ──────────────────────────────────────────

  test('passes the uploaded file to setCardImage when the front image button emits', async () => {
    const wrapper = mount({ card: { id: 42 } })
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    const frontButton = wrapper.findAllComponents(ImageButton)[0]
    await frontButton.vm.$emit('image-uploaded', file)
    expect(mocks.setCardImageMock).toHaveBeenCalledWith({
      card_id: 42,
      deck_id: 10,
      file,
      side: 'front'
    })
  })

  test('passes the side to setCardImage when the back image button emits', async () => {
    const wrapper = mount({ card: { id: 42 } })
    const file = new File(['x'], 'b.png', { type: 'image/png' })
    const backButton = wrapper.findAllComponents(ImageButton)[1]
    await backButton.vm.$emit('image-uploaded', file)
    expect(mocks.setCardImageMock).toHaveBeenCalledWith({
      card_id: 42,
      deck_id: 10,
      file,
      side: 'back'
    })
  })

  test('deletes the front image when the front image button emits image-deleted', async () => {
    const wrapper = mount({ card: { id: 42 } })
    const frontButton = wrapper.findAllComponents(ImageButton)[0]
    await frontButton.vm.$emit('image-deleted')
    expect(mocks.deleteCardImageMock).toHaveBeenCalledWith({
      card_id: 42,
      deck_id: 10,
      side: 'front'
    })
  })
})

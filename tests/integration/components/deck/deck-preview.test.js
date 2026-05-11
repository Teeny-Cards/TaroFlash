import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

const { cardsQueryMock, emitSfxMock } = vi.hoisted(() => ({
  cardsQueryMock: vi.fn(),
  emitSfxMock: vi.fn()
}))

vi.mock('@/api/cards', () => ({
  useCardsInDeckInfiniteQuery: cardsQueryMock
}))

vi.mock('@/sfx/bus', () => ({ emitSfx: emitSfxMock }))

import DeckPreview from '@/components/deck/deck-preview.vue'

const CardStub = defineComponent({
  name: 'Card',
  props: ['side', 'front_text', 'back_text', 'cover_config', 'card_attributes', 'face_classes'],
  emits: ['click'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', {
        'data-testid': 'card-stub',
        'data-side': props.side ?? '',
        'data-front': props.front_text ?? '',
        'data-back': props.back_text ?? '',
        onClick: () => emit('click')
      })
  }
})

const baseProps = {
  deck_id: 42,
  cover: { theme: 'blue-500' },
  card_attributes: { front: {}, back: {} },
  side: 'cover'
}

function mountPreview(props = {}) {
  return shallowMount(DeckPreview, {
    props: { ...baseProps, ...props },
    global: { stubs: { Card: CardStub } }
  })
}

describe('DeckPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cardsQueryMock.mockReturnValue({ data: ref({ pages: [[]] }) })
  })

  test('renders the preview container with a single card stub', () => {
    const wrapper = mountPreview()
    expect(wrapper.find('[data-testid="deck-preview"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="card-stub"]')).toHaveLength(1)
  })

  test('passes the active side to the card', () => {
    const wrapper = mountPreview({ side: 'front' })
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-side')).toBe('front')
  })

  test('uses the first card front_text when side is front and a card exists', () => {
    cardsQueryMock.mockReturnValue({
      data: ref({ pages: [[{ front_text: 'hello front', back_text: 'hello back' }]] })
    })
    const wrapper = mountPreview({ side: 'front' })
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-front')).toBe('hello front')
  })

  test('uses the first card back_text when side is back', () => {
    cardsQueryMock.mockReturnValue({
      data: ref({ pages: [[{ front_text: 'hello front', back_text: 'hello back' }]] })
    })
    const wrapper = mountPreview({ side: 'back' })
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-back')).toBe('hello back')
  })

  test('falls back to translated placeholder when first card has no text', () => {
    cardsQueryMock.mockReturnValue({ data: ref({ pages: [[{}]] }) })
    const wrapper = mountPreview({ side: 'front' })
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-front')).not.toBe('')
  })

  test('does not pass front/back text on the cover side', () => {
    cardsQueryMock.mockReturnValue({
      data: ref({ pages: [[{ front_text: 'hello front', back_text: 'hello back' }]] })
    })
    const wrapper = mountPreview({ side: 'cover' })
    const card = wrapper.find('[data-testid="card-stub"]')
    expect(card.attributes('data-front')).toBe('')
    expect(card.attributes('data-back')).toBe('')
  })

  test('clicking the card cycles cover → front', async () => {
    const wrapper = mountPreview({ side: 'cover' })
    await wrapper.find('[data-testid="card-stub"]').trigger('click')
    expect(wrapper.emitted('update:side')).toEqual([['front']])
  })

  test('clicking cycles front → back', async () => {
    const wrapper = mountPreview({ side: 'front' })
    await wrapper.find('[data-testid="card-stub"]').trigger('click')
    expect(wrapper.emitted('update:side')).toEqual([['back']])
  })

  test('clicking cycles back → cover (wraps around)', async () => {
    const wrapper = mountPreview({ side: 'back' })
    await wrapper.find('[data-testid="card-stub"]').trigger('click')
    expect(wrapper.emitted('update:side')).toEqual([['cover']])
  })

  test('queries cards using the supplied deck_id', () => {
    mountPreview({ deck_id: 99 })
    // The composable receives a getter; invoke it to confirm the deck_id flows through.
    const getter = cardsQueryMock.mock.calls[0][0]
    expect(getter()).toBe(99)
  })
})

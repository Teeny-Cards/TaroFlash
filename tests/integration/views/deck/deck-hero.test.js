import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

vi.mock('@/composables/modals/use-deck-settings-modal', () => ({
  useDeckSettingsModal: () => ({ open: vi.fn(() => ({ response: Promise.resolve(false) })) })
}))
vi.mock('@/composables/modals/use-study-modal', () => ({
  useStudyModal: () => ({ start: vi.fn() })
}))

import OverviewPanel from '@/views/deck/overview-panel.vue'

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  props: ['disabled'],
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () => h('button', { ...attrs, onClick: () => emit('click') }, slots.default?.())
  }
})

function mount(deck = {}) {
  return shallowMount(OverviewPanel, {
    props: {
      deck: { id: 1, title: 'd', card_count: 10, ...deck }
    },
    global: { stubs: { UiButton: UiButtonStub } }
  })
}

function studyButton(wrapper) {
  return wrapper
    .findAllComponents({ name: 'UiButton' })
    .find((b) => b.attributes('data-testid') === 'overview-panel__study-button')
}

describe('OverviewPanel', () => {
  // ── study_disabled is driven by deck.card_count (was deck.cards.length) ─────

  test('enables the study button when card_count > 0', () => {
    const wrapper = mount({ card_count: 5 })
    expect(studyButton(wrapper).props('disabled')).toBe(false)
  })

  test('disables the study button when card_count is 0', () => {
    const wrapper = mount({ card_count: 0 })
    expect(studyButton(wrapper).props('disabled')).toBe(true)
  })

  test('disables the study button when card_count is missing (treated as 0)', () => {
    const wrapper = mount({ card_count: undefined })
    expect(studyButton(wrapper).props('disabled')).toBe(true)
  })

  // ── Display ────────────────────────────────────────────────────────────────

  test('renders the card_count in the cards-in-deck label', () => {
    const wrapper = mount({ card_count: 17 })
    expect(wrapper.text()).toContain('17 cards in deck')
  })

  test('renders 0 in the cards-in-deck label when card_count is missing', () => {
    const wrapper = mount({ card_count: undefined })
    expect(wrapper.text()).toContain('0 cards in deck')
  })

  test('renders the deck description', () => {
    const wrapper = mount({ description: 'My description' })
    expect(wrapper.find('[data-testid="overview-panel__description"]').text()).toBe(
      'My description'
    )
  })

  test('renders the member display name from deck.member', () => {
    const wrapper = mount({ member: { display_name: 'Alice' } })
    expect(wrapper.text()).toContain('Alice')
  })
})

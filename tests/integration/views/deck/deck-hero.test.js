import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, ref, useAttrs } from 'vue'

const { mockOpenSettings, mockStartStudy } = vi.hoisted(() => ({
  mockOpenSettings: vi.fn(() => ({ response: Promise.resolve(false) })),
  mockStartStudy: vi.fn()
}))

vi.mock('@/composables/modals/use-deck-settings-modal', () => ({
  useDeckSettingsModal: () => ({ open: mockOpenSettings })
}))
vi.mock('@/composables/modals/use-study-modal', () => ({
  useStudyModal: () => ({ start: mockStartStudy })
}))

import DeckHero from '@/views/deck/deck-hero.vue'

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  props: ['disabled'],
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () => h('button', { ...attrs, onClick: () => emit('click') }, slots.default?.())
  }
})

const DeckThumbnailStub = defineComponent({
  name: 'DeckThumbnail',
  inheritAttrs: false,
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () =>
      h(
        'div',
        { ...attrs, 'data-testid': 'deck-thumbnail', onClick: () => emit('click') },
        slots.actions?.()
      )
  }
})

function mount({ deck = {}, editor } = {}) {
  return shallowMount(DeckHero, {
    props: {
      deck: { id: 1, title: 'd', card_count: 10, ...deck }
    },
    global: {
      stubs: { UiButton: UiButtonStub, DeckThumbnail: DeckThumbnailStub },
      provide: editor === undefined ? {} : { 'card-editor': editor }
    }
  })
}

function makeEditor({ mode = 'view', setMode = vi.fn() } = {}) {
  return { mode: ref(mode), setMode }
}

function modeButton(wrapper) {
  return wrapper.find('[data-testid="overview-panel__settings-button"]')
}

describe('DeckHero', () => {
  beforeEach(() => {
    mockOpenSettings.mockClear()
    mockStartStudy.mockClear()
  })

  // ── Display ────────────────────────────────────────────────────────────────

  test('renders the card_count in the cards-in-deck label', () => {
    const wrapper = mount({ deck: { card_count: 17 } })
    expect(wrapper.text()).toContain('17 cards in deck')
  })

  test('renders 0 in the cards-in-deck label when card_count is missing', () => {
    const wrapper = mount({ deck: { card_count: undefined } })
    expect(wrapper.text()).toContain('0 cards in deck')
  })

  test('renders the deck description', () => {
    const wrapper = mount({ deck: { description: 'My description' } })
    expect(wrapper.find('[data-testid="overview-panel__description"]').text()).toBe(
      'My description'
    )
  })

  test('renders the member display name from deck.member_display_name', () => {
    const wrapper = mount({ deck: { member_display_name: 'Alice' } })
    expect(wrapper.text()).toContain('Alice')
  })

  // ── Mode-driven edit-cards button ─────────────────────────────────────────

  describe('mode toggle', () => {
    test('shows the "edit cards" label when injected mode is view', () => {
      const wrapper = mount({ editor: makeEditor({ mode: 'view' }) })
      expect(modeButton(wrapper).text()).toContain('Edit Cards')
    })

    test('shows the "cancel" label when injected mode is edit', () => {
      const wrapper = mount({ editor: makeEditor({ mode: 'edit' }) })
      expect(modeButton(wrapper).text()).toContain('Stop Editing')
    })

    test('clicking the button flips the editor mode from view to edit', async () => {
      const setMode = vi.fn()
      const wrapper = mount({ editor: makeEditor({ mode: 'view', setMode }) })
      await modeButton(wrapper).trigger('click')
      expect(setMode).toHaveBeenCalledWith('edit')
    })

    test('clicking the button flips the editor mode from edit to view', async () => {
      const setMode = vi.fn()
      const wrapper = mount({ editor: makeEditor({ mode: 'edit', setMode }) })
      await modeButton(wrapper).trigger('click')
      expect(setMode).toHaveBeenCalledWith('view')
    })

    test('clicking is a no-op when no editor is provided', async () => {
      const wrapper = mount()
      await modeButton(wrapper).trigger('click')
      // No throw + button still renders the default label
      expect(modeButton(wrapper).exists()).toBe(true)
    })
  })

  // ── Settings modal ────────────────────────────────────────────────────────

  describe('settings modal', () => {
    test('clicking the deck thumbnail opens the settings modal with the deck', async () => {
      const deck = { id: 42, title: 'd', card_count: 0 }
      const wrapper = mount({ deck })

      await wrapper.find('[data-testid="deck-thumbnail"]').trigger('click')

      expect(mockOpenSettings).toHaveBeenCalledTimes(1)
      expect(mockOpenSettings).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }))
    })

    test('clicking the study button starts the study session', async () => {
      const deck = { id: 7, title: 'd', card_count: 0 }
      const wrapper = mount({ deck })

      await wrapper.find('[data-testid="overview-panel__study-button"]').trigger('click')

      expect(mockStartStudy).toHaveBeenCalledTimes(1)
      expect(mockStartStudy).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }))
    })
  })
})

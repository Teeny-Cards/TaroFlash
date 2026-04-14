import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import DeckSettings from '@/components/modals/deck-settings/index.vue'

// ── Hoisted mocks ──────────────────────────────────────────────────────────────

const { mockSaveDeck } = vi.hoisted(() => ({
  mockSaveDeck: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@/composables/deck-editor', () => ({
  useDeckEditor: () => ({ saveDeck: mockSaveDeck })
}))

// ── Stubs ──────────────────────────────────────────────────────────────────────

// shallowMount stubs don't render named slots by default. Use a minimal stub
// that surfaces the body and footer slot content so we can assert on them.
// Stubs use render functions (not template strings) because the Vue runtime
// compiler is not available in browser mode.
const MobileSheetStub = defineComponent({
  name: 'MobileSheet',
  emits: ['close'],
  setup(_props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'mobile-sheet-stub' }, [slots.body?.(), slots.footer?.()])
  }
})

// Auto-generated shallowMount stubs do not forward slot content. Provide a
// custom stub that renders the default slot so we can assert on the button label.
const UiButtonStub = defineComponent({
  name: 'UiButton',
  setup(_props, { slots }) {
    return () => h('button', { 'data-testid': 'ui-button-stub' }, slots.default?.())
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeDeckSettings(props = {}) {
  return shallowMount(DeckSettings, {
    props: { close: vi.fn(), ...props },
    global: {
      stubs: { MobileSheet: MobileSheetStub, UiButton: UiButtonStub }
    }
  })
}

function makeDeck(overrides = {}) {
  return {
    id: 1,
    title: 'My Deck',
    description: 'A great description',
    is_public: true,
    cover_config: {},
    ...overrides
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DeckSettings', () => {
  beforeEach(() => {
    mockSaveDeck.mockClear()
    mockSaveDeck.mockResolvedValue(undefined)
  })

  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the body slot', () => {
    const wrapper = makeDeckSettings()
    expect(wrapper.find('[data-testid="deck-settings__body"]').exists()).toBe(true)
  })

  test('renders the footer slot', () => {
    const wrapper = makeDeckSettings()
    expect(wrapper.find('[data-testid="deck-settings__footer"]').exists()).toBe(true)
  })

  // ── Prop initialization ────────────────────────────────────────────────────

  test('pre-fills title input from deck prop', () => {
    const deck = makeDeck({ title: 'My Deck' })
    const wrapper = makeDeckSettings({ deck })
    const titleInput = wrapper.findAllComponents({ name: 'UiInput' })[0]
    expect(titleInput.props('value')).toBe('My Deck')
  })

  test('pre-fills description input from deck prop', () => {
    const deck = makeDeck({ description: 'Great description' })
    const wrapper = makeDeckSettings({ deck })
    const descInput = wrapper.findAllComponents({ name: 'UiInput' })[1]
    expect(descInput.props('value')).toBe('Great description')
  })

  test('pre-fills isPublic toggle from deck prop', () => {
    const deck = makeDeck({ is_public: false })
    const wrapper = makeDeckSettings({ deck })
    const toggle = wrapper.findComponent({ name: 'UiToggle' })
    expect(toggle.props('checked')).toBe(false)
  })

  test('defaults title to empty string when no deck prop', () => {
    const wrapper = makeDeckSettings()
    const titleInput = wrapper.findAllComponents({ name: 'UiInput' })[0]
    expect(titleInput.props('value')).toBe('')
  })

  test('defaults isPublic to true when no deck prop', () => {
    const wrapper = makeDeckSettings()
    const toggle = wrapper.findComponent({ name: 'UiToggle' })
    expect(toggle.props('checked')).toBe(true)
  })

  // ── Save behaviour ─────────────────────────────────────────────────────────

  test('save button calls saveDeck and closes with true', async () => {
    const close = vi.fn()
    const wrapper = makeDeckSettings({ deck: makeDeck(), close })
    await wrapper
      .find('[data-testid="deck-settings__footer"] [data-testid="ui-button-stub"]')
      .trigger('click')
    await flushPromises()
    expect(mockSaveDeck).toHaveBeenCalledOnce()
    expect(close).toHaveBeenCalledWith(true)
  })

  // ── Close behaviour ────────────────────────────────────────────────────────

  test('close event from MobileSheet calls close(false)', async () => {
    const close = vi.fn()
    const wrapper = makeDeckSettings({ close })
    await wrapper.findComponent(MobileSheetStub).vm.$emit('close')
    expect(close).toHaveBeenCalledWith(false)
  })

  // ── Save button label ──────────────────────────────────────────────────────

  test('save button shows "Save" when a deck is provided', () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    expect(
      wrapper.find('[data-testid="deck-settings__footer"] [data-testid="ui-button-stub"]').text()
    ).toContain('Save')
  })

  test('save button shows "Create" when no deck is provided', () => {
    const wrapper = makeDeckSettings()
    expect(
      wrapper.find('[data-testid="deck-settings__footer"] [data-testid="ui-button-stub"]').text()
    ).toContain('Create')
  })
})

import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import DeckSettings from '@/components/modals/deck-settings/index.vue'

// ── Hoisted mocks ──────────────────────────────────────────────────────────────

const { mockSaveDeck } = vi.hoisted(() => ({
  mockSaveDeck: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@/composables/deck-editor', async () => {
  const { reactive } = await import('vue')
  return {
    useDeckEditor: (deck) => ({
      saveDeck: mockSaveDeck,
      settings: reactive({
        id: deck?.id,
        title: deck?.title ?? '',
        description: deck?.description ?? '',
        is_public: deck?.is_public ?? true
      }),
      cover: reactive({}),
      card_attributes: reactive({ front: {}, back: {} })
    })
  }
})

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

// Auto-stubs try to forward component props as DOM attributes, which fails for
// reserved names like `attributes`. Provide render-function stubs that don't
// propagate props to the underlying element.
const CardDesignerToolbarStub = defineComponent({
  name: 'CardDesignerToolbar',
  props: ['attributes'],
  setup: () => () => h('div', { 'data-testid': 'card-designer-toolbar-stub' })
})

const CoverDesignerToolbarStub = defineComponent({
  name: 'CoverDesignerToolbar',
  props: ['config'],
  setup: () => () => h('div', { 'data-testid': 'cover-designer-toolbar-stub' })
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeDeckSettings(props = {}) {
  return shallowMount(DeckSettings, {
    props: { close: vi.fn(), ...props },
    global: {
      stubs: {
        MobileSheet: MobileSheetStub,
        UiButton: UiButtonStub,
        CardDesignerToolbar: CardDesignerToolbarStub,
        CoverDesignerToolbar: CoverDesignerToolbarStub
      }
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

  // ── Card designer toolbar ───────────────────────────────────────────────────

  test('renders the cover designer toolbar by default', () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    expect(wrapper.findComponent({ name: 'CoverDesignerToolbar' }).exists()).toBe(true)
  })

  test('does not render the card designer toolbar on the cover tab', () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    expect(wrapper.findComponent({ name: 'CardDesignerToolbar' }).exists()).toBe(false)
  })

  // ── Tab switching ──────────────────────────────────────────────────────────

  test('renders the card designer toolbar with front attributes when front tab is active', async () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    const tabBar = wrapper.findComponent({ name: 'TabBar' })
    await tabBar.vm.$emit('update:active', 'front')
    const cardToolbar = wrapper.findComponent({ name: 'CardDesignerToolbar' })
    expect(cardToolbar.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CoverDesignerToolbar' }).exists()).toBe(false)
  })

  test('renders the card designer toolbar for the back tab', async () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    const tabBar = wrapper.findComponent({ name: 'TabBar' })
    await tabBar.vm.$emit('update:active', 'back')
    expect(wrapper.findComponent({ name: 'CardDesignerToolbar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CoverDesignerToolbar' }).exists()).toBe(false)
  })

  test('updates the card preview side to match active tab', async () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    const card = wrapper.findComponent({ name: 'Card' })
    expect(card.props('side')).toBe('cover')

    await wrapper.findComponent({ name: 'TabBar' }).vm.$emit('update:active', 'front')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('front')

    await wrapper.findComponent({ name: 'TabBar' }).vm.$emit('update:active', 'back')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('back')
  })

  test('no-ops when the active tab is re-selected', async () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    await wrapper.findComponent({ name: 'TabBar' }).vm.$emit('update:active', 'cover')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('cover')
    expect(wrapper.findComponent({ name: 'CoverDesignerToolbar' }).exists()).toBe(true)
  })

  test('clicking the card cycles to the next tab', async () => {
    const wrapper = makeDeckSettings({ deck: makeDeck() })
    await wrapper.findComponent({ name: 'Card' }).vm.$emit('click')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('front')

    await wrapper.findComponent({ name: 'Card' }).vm.$emit('click')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('back')

    await wrapper.findComponent({ name: 'Card' }).vm.$emit('click')
    expect(wrapper.findComponent({ name: 'Card' }).props('side')).toBe('cover')
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

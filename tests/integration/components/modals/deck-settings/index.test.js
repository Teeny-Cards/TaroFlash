import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import DeckSettings from '@/components/modals/deck-settings/index.vue'
import { deck as deckFixture } from '../../../../fixtures/deck'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockAlertWarn, mockToastSuccess, mockToastError, mockEditor, mockRouterPush, initialTab } =
  vi.hoisted(() => ({
    mockAlertWarn: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
    mockEditor: {
      resetReviews: vi.fn().mockResolvedValue(true),
      deleteDeck: vi.fn().mockResolvedValue(true),
      saveDeck: vi.fn().mockResolvedValue(true)
    },
    mockRouterPush: vi.fn(),
    initialTab: { value: 'danger-zone' }
  }))

vi.mock('@/composables/alert', () => ({
  useAlert: () => ({ warn: mockAlertWarn })
}))

vi.mock('@/composables/toast', () => ({
  useToast: () => ({ success: mockToastSuccess, error: mockToastError })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ name: 'dashboard', params: {} })
}))

vi.mock('@/composables/use-media-query', async () => {
  const vue = await import('vue')
  const isTablet = vue.ref(false)
  globalThis.__deckSettingsIsTablet = isTablet
  return {
    useMobileBreakpoint: () => vue.ref(false),
    useMediaQuery: () => vue.ref(false),
    useIsTablet: () => isTablet
  }
})

function setBelowLg(v) {
  if (globalThis.__deckSettingsIsTablet) globalThis.__deckSettingsIsTablet.value = v
}

vi.mock('@/composables/deck-editor', async () => {
  const { reactive, ref: vueRef } = await import('vue')
  const editor = {
    deck: { id: 1 },
    settings: reactive({}),
    config: reactive({}),
    cover: reactive({}),
    card_attributes: reactive({ front: {}, back: {} }),
    cover_image_preview: vueRef(undefined),
    cover_image_loading: vueRef(false),
    active_side: vueRef('cover'),
    is_dirty: vueRef(false),
    deleting: vueRef(false),
    resetting_reviews: vueRef(false),
    saveDeck: (...args) => mockEditor.saveDeck(...args),
    deleteDeck: (...args) => mockEditor.deleteDeck(...args),
    resetReviews: (...args) => mockEditor.resetReviews(...args),
    uploadImage: () => {},
    removeImage: () => {},
    setCoverImage: async () => {},
    removeCoverImage: () => {},
    setActiveSide: () => {}
  }
  // expose on the mockEditor handle so individual tests can flip dirty state
  mockEditor.editor = editor
  return {
    useDeckEditor: () => editor,
    deckEditorKey: Symbol('deckEditor')
  }
})

// `<script setup>` imports are direct bindings — Vue's `stubs` option can't
// replace them. Use module mocks for the tab children we want stubbed.
vi.mock('@/components/modals/deck-settings/deck-aside.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'DeckAside',
      props: ['deck'],
      setup(props) {
        return () =>
          h('div', {
            'data-testid': 'deck-aside-stub',
            'data-deck-id': props.deck?.id ?? ''
          })
      }
    })
  }
})

vi.mock('@/components/modals/deck-settings/tab-danger-zone/index.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'TabDangerZone',
      emits: ['delete', 'reset-reviews'],
      setup(_props, { emit }) {
        return () =>
          h('div', { 'data-testid': 'tab-danger-zone-stub' }, [
            h(
              'button',
              { 'data-testid': 'tdz__reset', onClick: () => emit('reset-reviews') },
              'reset'
            ),
            h('button', { 'data-testid': 'tdz__delete', onClick: () => emit('delete') }, 'delete')
          ])
      }
    })
  }
})

vi.mock('@/composables/use-session-ref', () => ({
  // The deck-settings active tab is driven by `initialTab.value` from the
  // hoisted block — tests can flip it before mount to render any tab.
  useSessionRef: (key, initial) =>
    ref(key === 'deck-settings.active-tab' ? initialTab.value : initial)
}))

// ── Stubs ─────────────────────────────────────────────────────────────────────

const TabSheetStub = defineComponent({
  emits: ['close', 'update:active'],
  setup(_props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'tab-sheet' }, [
        h('div', { 'data-testid': 'tab-sheet__header-content' }, slots['header-content']?.()),
        slots.default?.(),
        slots.overlay?.(),
        h('div', { 'data-testid': 'tab-sheet__footer' }, slots.footer?.())
      ])
  }
})

const UiButtonStub = defineComponent({
  name: 'UiButton',
  setup(_props, { slots, attrs }) {
    return () => h('button', { 'data-testid': 'ui-button', ...attrs }, slots.default?.())
  }
})

const TabDangerZoneStub = defineComponent({
  name: 'TabDangerZone',
  emits: ['delete', 'reset-reviews'],
  setup(_props, { emit }) {
    return () =>
      h('div', { 'data-testid': 'tab-danger-zone-stub' }, [
        h(
          'button',
          {
            'data-testid': 'tdz__reset',
            onClick: () => emit('reset-reviews')
          },
          'reset'
        ),
        h(
          'button',
          {
            'data-testid': 'tdz__delete',
            onClick: () => emit('delete')
          },
          'delete'
        )
      ])
  }
})

const PassthroughStub = defineComponent({
  setup() {
    return () => h('div')
  }
})

const DeckAsideStub = defineComponent({
  name: 'DeckAside',
  props: ['deck'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'deck-aside-stub',
        'data-deck-id': props.deck?.id ?? ''
      })
  }
})

function makeWrapper() {
  const close = vi.fn()
  const wrapper = mount(DeckSettings, {
    props: { deck: deckFixture.one({ overrides: { id: 1 } }), close },
    global: {
      stubs: {
        TabSheet: TabSheetStub,
        TabDesign: PassthroughStub,
        TabGeneral: PassthroughStub,
        TabStudy: PassthroughStub,
        TabDangerZone: TabDangerZoneStub,
        DeckPreview: PassthroughStub,
        DeckAside: DeckAsideStub,
        UiButton: UiButtonStub
      },
      mocks: { $t: (k) => k }
    }
  })
  return { wrapper, close }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockAlertWarn.mockReset()
  mockToastSuccess.mockReset()
  mockToastError.mockReset()
  mockRouterPush.mockReset()
  mockEditor.resetReviews.mockReset().mockResolvedValue(true)
  mockEditor.deleteDeck.mockReset().mockResolvedValue(true)
  mockEditor.saveDeck.mockReset().mockResolvedValue(true)
  initialTab.value = 'danger-zone'
  setBelowLg(false)
})

describe('DeckSettings — save button visibility (driven by editor.is_dirty)', () => {
  test('hides the save button when the editor is not dirty', () => {
    mockEditor.editor.is_dirty.value = false
    const { wrapper } = makeWrapper()

    const footer = wrapper.find('[data-testid="tab-sheet__footer"]')
    expect(footer.find('[data-testid="ui-button"]').exists()).toBe(false)
  })

  test('shows the save button when the editor reports a dirty state', () => {
    mockEditor.editor.is_dirty.value = true
    const { wrapper } = makeWrapper()

    const footer = wrapper.find('[data-testid="tab-sheet__footer"]')
    expect(footer.find('[data-testid="ui-button"]').exists()).toBe(true)
  })

  test('clicking the save button calls editor.saveDeck and closes on success', async () => {
    mockEditor.editor.is_dirty.value = true
    mockEditor.saveDeck.mockResolvedValue(true)
    const { wrapper, close } = makeWrapper()

    await wrapper.find('[data-testid="ui-button"]').trigger('click')
    await flushPromises()

    expect(mockEditor.saveDeck).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledWith(true)
  })
})

describe('DeckSettings — header copy is tab-driven', () => {
  const cases = [
    {
      tab: 'general',
      title: 'Details & Settings',
      description: 'Name, description, and visibility.'
    },
    { tab: 'design', title: 'Card Designer', description: 'Cover art and card layout.' },
    { tab: 'study', title: 'Study Preferences', description: 'Pacing and daily limits.' },
    { tab: 'danger-zone', title: 'Danger Zone', description: 'Delete or reset this deck.' }
  ]

  for (const { tab, title, description } of cases) {
    test(`renders the ${tab} title + description`, () => {
      initialTab.value = tab
      const { wrapper } = makeWrapper()

      expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe(title)
      expect(wrapper.find('[data-testid="deck-settings__header-description"]').text()).toBe(
        description
      )
    })
  }
})

describe('DeckSettings — aside wiring', () => {
  test('renders the DeckAside with the deck prop forwarded', () => {
    const { wrapper } = makeWrapper()

    const aside = wrapper.find('[data-testid="deck-settings__aside"]')
    expect(aside.exists()).toBe(true)
    expect(aside.attributes('data-deck-id')).toBe('1')
  })
})

describe('DeckSettings — null active_tab + breakpoint redirect', () => {
  test('null active_tab renders the general header on desktop', () => {
    initialTab.value = null
    setBelowLg(false)
    const { wrapper } = makeWrapper()
    expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe(
      'Details & Settings'
    )
  })

  test('null active_tab renders the index header below lg', () => {
    initialTab.value = null
    setBelowLg(true)
    const { wrapper } = makeWrapper()
    expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe('Deck Settings')
  })

  test('crossing into below-lg with danger-zone selected redirects to the index (null)', async () => {
    initialTab.value = 'danger-zone'
    setBelowLg(false)
    const { wrapper } = makeWrapper()

    expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe('Danger Zone')

    setBelowLg(true)
    await flushPromises()

    expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe('Deck Settings')
  })

  test('explicit general tab persists across resize (no auto-collapse to index)', async () => {
    initialTab.value = 'general'
    setBelowLg(false)
    const { wrapper } = makeWrapper()

    setBelowLg(true)
    await flushPromises()

    expect(wrapper.find('[data-testid="deck-settings__header-title"]').text()).toBe(
      'Details & Settings'
    )
  })
})

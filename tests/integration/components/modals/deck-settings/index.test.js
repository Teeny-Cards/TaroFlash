import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import DeckSettings from '@/components/modals/deck-settings/index.vue'
import { deck as deckFixture } from '../../../../fixtures/deck'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockAlertWarn, mockToastSuccess, mockToastError, mockEditor, mockRouterPush } = vi.hoisted(
  () => ({
    mockAlertWarn: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
    mockEditor: {
      resetReviews: vi.fn().mockResolvedValue(true),
      deleteDeck: vi.fn().mockResolvedValue(true),
      saveDeck: vi.fn().mockResolvedValue(true)
    },
    mockRouterPush: vi.fn()
  })
)

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
  // Force the deck-settings active tab to 'danger-zone' so the reset/delete
  // controls are rendered. All other sessionRef callers fall through to the
  // provided initial value.
  useSessionRef: (key, initial) => ref(key === 'deck-settings.active-tab' ? 'danger-zone' : initial)
}))

// ── Stubs ─────────────────────────────────────────────────────────────────────

const TabSheetStub = defineComponent({
  emits: ['close', 'update:active'],
  setup(_props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'tab-sheet' }, [
        slots.default?.(),
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
})

describe('DeckSettings — onResetReviews orchestration', () => {
  test('does nothing when the user cancels the confirm alert', async () => {
    mockAlertWarn.mockReturnValue({ response: Promise.resolve(false) })
    const { wrapper } = makeWrapper()

    await wrapper.find('[data-testid="tdz__reset"]').trigger('click')
    await flushPromises()

    expect(mockAlertWarn).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Reset All Reviews?' })
    )
    expect(mockEditor.resetReviews).not.toHaveBeenCalled()
    expect(mockToastSuccess).not.toHaveBeenCalled()
    expect(mockToastError).not.toHaveBeenCalled()
  })

  test('calls editor.resetReviews and fires a success toast when the mutation succeeds', async () => {
    mockAlertWarn.mockReturnValue({ response: Promise.resolve(true) })
    mockEditor.resetReviews.mockResolvedValue(true)
    const { wrapper, close } = makeWrapper()

    await wrapper.find('[data-testid="tdz__reset"]').trigger('click')
    await flushPromises()

    expect(mockEditor.resetReviews).toHaveBeenCalledTimes(1)
    expect(mockToastSuccess).toHaveBeenCalledWith('Reviews reset for this deck.')
    expect(mockToastError).not.toHaveBeenCalled()
    // Reset does not close the modal — user stays on the danger-zone tab.
    expect(close).not.toHaveBeenCalled()
  })

  test('fires an error toast (no success toast) when the mutation fails', async () => {
    mockAlertWarn.mockReturnValue({ response: Promise.resolve(true) })
    mockEditor.resetReviews.mockResolvedValue(false)
    const { wrapper } = makeWrapper()

    await wrapper.find('[data-testid="tdz__reset"]').trigger('click')
    await flushPromises()

    expect(mockEditor.resetReviews).toHaveBeenCalledTimes(1)
    expect(mockToastError).toHaveBeenCalledWith(
      "Couldn't reset reviews for this deck. Please try again."
    )
    expect(mockToastSuccess).not.toHaveBeenCalled()
  })
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

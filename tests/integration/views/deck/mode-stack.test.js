import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, ref, nextTick } from 'vue'

vi.mock('@/utils/animations/deck-view/card-overlay', () => ({
  primeOverlayBelow: vi.fn(),
  slideOverlayUp: vi.fn((_el, done) => done?.()),
  slideOverlayDown: vi.fn((_el, done) => done?.())
}))

import ModeStack from '@/views/deck/mode-stack.vue'

const CardGridStub = defineComponent({
  name: 'CardGrid',
  inheritAttrs: false,
  setup(_p, { attrs }) {
    return () => h('div', { ...attrs, 'data-testid': 'card-grid-stub' })
  }
})

const CardEditorStub = defineComponent({
  name: 'CardEditor',
  setup() {
    return () => h('div', { 'data-testid': 'card-editor-stub' })
  }
})

const CardImporterStub = defineComponent({
  name: 'CardImporter',
  setup() {
    return () => h('div', { 'data-testid': 'card-importer-stub' })
  }
})

function makeEditor(mode = 'view') {
  return { mode: ref(mode) }
}

function mount(editor = makeEditor()) {
  return shallowMount(ModeStack, {
    global: {
      provide: { 'card-editor': editor },
      stubs: {
        CardGrid: CardGridStub,
        CardEditor: CardEditorStub,
        CardImporter: CardImporterStub
      }
    }
  })
}

describe('ModeStack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the mode-stack root, grid, and overlay-clip wrapper', () => {
    const wrapper = mount()
    expect(wrapper.attributes('data-testid')).toBe('deck-view__mode-stack')
    expect(wrapper.findComponent({ name: 'CardGrid' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="deck-view__mode-stack__overlay-clip"]').exists()).toBe(true)
  })

  test('overlay-clip wrapper is absolute, clipped, and pointer-events disabled', () => {
    const wrapper = mount()
    const cls = wrapper.find('[data-testid="deck-view__mode-stack__overlay-clip"]').classes()
    expect(cls).toContain('absolute')
    expect(cls).toContain('overflow-hidden')
    expect(cls).toContain('pointer-events-none')
  })

  test('does not apply scale-95 to the grid in view mode', () => {
    const wrapper = mount(makeEditor('view'))
    const cls = wrapper.findComponent({ name: 'CardGrid' }).classes()
    expect(cls).not.toContain('scale-95')
  })

  test('applies scale-95 to the grid when mode is edit', () => {
    const wrapper = mount(makeEditor('edit'))
    const cls = wrapper.findComponent({ name: 'CardGrid' }).classes()
    expect(cls).toContain('scale-95')
  })

  test('applies scale-95 to the grid when mode is import-export', () => {
    const wrapper = mount(makeEditor('import-export'))
    const cls = wrapper.findComponent({ name: 'CardGrid' }).classes()
    expect(cls).toContain('scale-95')
  })

  // shallowMount wraps overlay content in <transition-stub>. The dynamic
  // `<component :is>` resolves to either nothing (view mode) or an SFC stub
  // (`<index-stub>` for both card-editor/index.vue and card-importer.vue).
  function hasOverlayChild(wrapper) {
    return wrapper.find('[data-testid="deck-view__mode-stack__overlay-clip"] transition-stub')
      .element.children.length
  }

  test('renders no overlay component in view mode', () => {
    const wrapper = mount(makeEditor('view'))
    expect(hasOverlayChild(wrapper)).toBe(0)
  })

  test('renders an overlay component when mode is edit', async () => {
    const editor = makeEditor('view')
    const wrapper = mount(editor)
    expect(hasOverlayChild(wrapper)).toBe(0)

    editor.mode.value = 'edit'
    await nextTick()
    await nextTick()

    expect(hasOverlayChild(wrapper)).toBe(1)
  })

  test('renders an overlay component when mode is import-export', async () => {
    const editor = makeEditor('view')
    const wrapper = mount(editor)

    editor.mode.value = 'import-export'
    await nextTick()
    await nextTick()

    expect(hasOverlayChild(wrapper)).toBe(1)
  })

  test('removes the overlay when returning to view mode', async () => {
    const editor = makeEditor('edit')
    const wrapper = mount(editor)
    expect(hasOverlayChild(wrapper)).toBe(1)

    editor.mode.value = 'view'
    await nextTick()
    await nextTick()

    expect(hasOverlayChild(wrapper)).toBe(0)
  })

  test('forwards size-full and pointer-events-auto to the overlay element', () => {
    const wrapper = mount(makeEditor('edit'))
    const overlay = wrapper.find(
      '[data-testid="deck-view__mode-stack__overlay-clip"] transition-stub'
    ).element.firstElementChild
    expect(overlay).not.toBeNull()
    expect(overlay.classList.contains('size-full')).toBe(true)
    expect(overlay.classList.contains('pointer-events-auto')).toBe(true)
  })
})

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

function transitions(wrapper) {
  return wrapper.findAll('[data-testid="deck-view__mode-stack__overlay-clip"] transition-stub')
}

function editorTransition(wrapper) {
  return transitions(wrapper)[0]
}

function importerTransition(wrapper) {
  return transitions(wrapper)[1]
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

  test('renders the card-editor at all times for stable scroll target', () => {
    const wrapper = mount(makeEditor('view'))
    expect(wrapper.findComponent({ name: 'CardEditor' }).exists()).toBe(true)
  })

  test('hides the card-editor wrapper via display:none in view mode', () => {
    const wrapper = mount(makeEditor('view'))
    const editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.style.display).toBe('none')
  })

  test('shows the card-editor wrapper when mode is edit', () => {
    const wrapper = mount(makeEditor('edit'))
    const editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.style.display).toBe('')
  })

  test('toggles card-editor visibility when mode flips between view and edit', async () => {
    const editor = makeEditor('view')
    const wrapper = mount(editor)
    let editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.style.display).toBe('none')

    editor.mode.value = 'edit'
    await nextTick()
    await nextTick()
    editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.style.display).toBe('')

    editor.mode.value = 'view'
    await nextTick()
    await nextTick()
    editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.style.display).toBe('none')
  })

  test('does not render the card-importer in view mode', () => {
    const wrapper = mount(makeEditor('view'))
    expect(importerTransition(wrapper).element.children.length).toBe(0)
    expect(wrapper.findComponent({ name: 'CardImporter' }).exists()).toBe(false)
  })

  test('renders the card-importer when mode is import-export', async () => {
    const editor = makeEditor('view')
    const wrapper = mount(editor)
    expect(wrapper.findComponent({ name: 'CardImporter' }).exists()).toBe(false)

    editor.mode.value = 'import-export'
    await nextTick()
    await nextTick()

    expect(wrapper.findComponent({ name: 'CardImporter' }).exists()).toBe(true)
  })

  test('removes the card-importer when leaving import-export mode', async () => {
    const editor = makeEditor('import-export')
    const wrapper = mount(editor)
    expect(wrapper.findComponent({ name: 'CardImporter' }).exists()).toBe(true)

    editor.mode.value = 'view'
    await nextTick()
    await nextTick()

    expect(wrapper.findComponent({ name: 'CardImporter' }).exists()).toBe(false)
  })

  test('forwards size-full and pointer-events-auto to the editor wrapper', () => {
    const wrapper = mount(makeEditor('edit'))
    const editorWrapper = editorTransition(wrapper).element.firstElementChild
    expect(editorWrapper.classList.contains('size-full')).toBe(true)
    expect(editorWrapper.classList.contains('pointer-events-auto')).toBe(true)
  })

  test('forwards size-full and pointer-events-auto to the importer', () => {
    const wrapper = mount(makeEditor('import-export'))
    const importerEl = importerTransition(wrapper).element.firstElementChild
    expect(importerEl.classList.contains('size-full')).toBe(true)
    expect(importerEl.classList.contains('pointer-events-auto')).toBe(true)
  })
})

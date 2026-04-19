import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref, computed, defineComponent, h, useAttrs } from 'vue'

import BulkSelectToolbar from '@/views/deck/bulk-select-toolbar.vue'

// shallowMount strips slot content by default. The toolbar renders its labels
// (e.g. "Select All", "Delete (N)") inside <ui-button> defaults, so we need a
// stub that surfaces the slot text + forwards attrs (disabled, click, etc.).
const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  // Declare `disabled` so .props('disabled') resolves on findComponent — the
  // toolbar's only behaviorally-relevant binding the tests need to inspect.
  props: ['disabled'],
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('button', attrs, slots.default?.())
  }
})

function makeEditorStub(overrides = {}) {
  return {
    mode: ref('select'),
    all_cards_selected: computed(() => false),
    selected_count: computed(() => 0),
    select_all_mode: ref(false),
    ...overrides
  }
}

function mount(editor = makeEditorStub()) {
  return shallowMount(BulkSelectToolbar, {
    global: {
      provide: { 'card-editor': editor },
      stubs: { UiButton: UiButtonStub }
    }
  })
}

describe('BulkSelectToolbar', () => {
  // ── Emits ──────────────────────────────────────────────────────────────────

  test('emits cancel when the cancel button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click') // cancel is first
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  test('emits toggle-all when the select-all button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('toggle-all')).toHaveLength(1)
  })

  test('emits move when the move button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    await buttons[2].trigger('click')
    expect(wrapper.emitted('move')).toHaveLength(1)
  })

  test('emits delete when the delete button is clicked', async () => {
    const wrapper = mount()
    const buttons = wrapper.findAll('button')
    await buttons[3].trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  // ── Select-all label flip ──────────────────────────────────────────────────

  test('shows "Select All" label when nothing is selected', () => {
    const wrapper = mount(
      makeEditorStub({ all_cards_selected: computed(() => false) })
    )
    expect(wrapper.text()).toContain('Select All')
    expect(wrapper.text()).not.toContain('Deselect All')
  })

  test('shows "Deselect All" label when everything is selected', () => {
    const wrapper = mount(
      makeEditorStub({ all_cards_selected: computed(() => true) })
    )
    expect(wrapper.text()).toContain('Deselect All')
  })

  // ── Selected count display ─────────────────────────────────────────────────

  test('renders the selected_count from the editor', () => {
    const wrapper = mount(makeEditorStub({ selected_count: computed(() => 7) }))
    expect(wrapper.text()).toContain('Delete (7)')
  })

  test('renders 0 in the delete label when the editor is missing (defensive default)', () => {
    const wrapper = shallowMount(BulkSelectToolbar, {
      global: { stubs: { UiButton: UiButtonStub } }
    })
    expect(wrapper.text()).toContain('Delete (0)')
  })

  // ── A2 select-all-mode disables Move ───────────────────────────────────────

  test('disables the Move button while select_all_mode is on', () => {
    const wrapper = mount(makeEditorStub({ select_all_mode: ref(true) }))
    const moveButton = wrapper.findAllComponents({ name: 'UiButton' })[2]
    expect(moveButton.props('disabled')).toBe(true)
  })

  test('leaves the Move button enabled when select_all_mode is off', () => {
    const wrapper = mount(makeEditorStub({ select_all_mode: ref(false) }))
    const moveButton = wrapper.findAllComponents({ name: 'UiButton' })[2]
    expect(moveButton.props('disabled')).toBe(false)
  })

  // ── Visibility toggle (mode-driven) ────────────────────────────────────────

  test('keeps the menu mounted regardless of mode (the slide is class-driven, not v-if)', () => {
    const wrapperHidden = mount(makeEditorStub({ mode: ref('view') }))
    const wrapperShown = mount(makeEditorStub({ mode: ref('select') }))
    expect(wrapperHidden.find('[data-testid="card-list__select-menu"]').exists()).toBe(true)
    expect(wrapperShown.find('[data-testid="card-list__select-menu"]').exists()).toBe(true)
  })
})

import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { reactive, defineComponent, h } from 'vue'
import CardDesignerToolbar from '@/components/modals/deck-settings/card-designer-toolbar.vue'

// ── Stubs ──────────────────────────────────────────────────────────────────────

// The toolbar composes `./cover-designer/picker-popover.vue`. Stub it to expose
// its default slot content inline so we can interact with the option buttons
// without rendering the full popover UI.
const PickerPopoverStub = defineComponent({
  name: 'PickerPopover',
  props: ['label', 'icon'],
  setup(_props, { slots }) {
    return () => h('div', { 'data-testid': 'popover-stub' }, slots.default?.())
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeToolbar(initial = {}) {
  const attributes = reactive(initial)

  const wrapper = shallowMount(CardDesignerToolbar, {
    props: { attributes },
    global: {
      stubs: { PickerPopover: PickerPopoverStub }
    }
  })

  return { wrapper, attributes }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('CardDesignerToolbar', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the toolbar container', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.find('[data-testid="card-designer-toolbar"]').exists()).toBe(true)
  })

  test('renders three popovers (text size, h-align, v-align)', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.findAll('[data-testid="popover-stub"]')).toHaveLength(3)
  })

  // ── Text size ──────────────────────────────────────────────────────────────

  test('renders all 6 text size options', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__text-size-option"]')
    expect(options).toHaveLength(6)
  })

  test('clicking a text size option updates attributes', async () => {
    const { wrapper, attributes } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__text-size-option"]')
    // First option is "Small"
    await options[0].trigger('click')
    expect(attributes.text_size).toBe('small')
  })

  test('marks the active text size option', () => {
    const { wrapper } = makeToolbar({ text_size: 'huge' })
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__text-size-option"]')
    // huge is the 5th option (index 4)
    expect(options[4].attributes('data-active')).toBe('true')
    expect(options[0].attributes('data-active')).toBe('false')
  })

  test('defaults the active text size to large when unset', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__text-size-option"]')
    // large is the 3rd option (index 2)
    expect(options[2].attributes('data-active')).toBe('true')
  })

  // ── Horizontal alignment ───────────────────────────────────────────────────

  test('renders 3 horizontal alignment options', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__h-align-option"]')
    expect(options).toHaveLength(3)
  })

  test('clicking a horizontal alignment option updates attributes', async () => {
    const { wrapper, attributes } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__h-align-option"]')
    await options[0].trigger('click')
    expect(attributes.horizontal_alignment).toBe('left')
  })

  test('marks the active horizontal alignment option', () => {
    const { wrapper } = makeToolbar({ horizontal_alignment: 'right' })
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__h-align-option"]')
    expect(options[2].attributes('data-active')).toBe('true')
    expect(options[0].attributes('data-active')).toBe('false')
  })

  test('defaults the active horizontal alignment to center', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__h-align-option"]')
    expect(options[1].attributes('data-active')).toBe('true')
  })

  // ── Vertical alignment ─────────────────────────────────────────────────────

  test('renders 3 vertical alignment options', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__v-align-option"]')
    expect(options).toHaveLength(3)
  })

  test('clicking a vertical alignment option updates attributes', async () => {
    const { wrapper, attributes } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__v-align-option"]')
    await options[2].trigger('click')
    expect(attributes.vertical_alignment).toBe('bottom')
  })

  test('marks the active vertical alignment option', () => {
    const { wrapper } = makeToolbar({ vertical_alignment: 'top' })
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__v-align-option"]')
    expect(options[0].attributes('data-active')).toBe('true')
    expect(options[1].attributes('data-active')).toBe('false')
  })

  test('defaults the active vertical alignment to center', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__v-align-option"]')
    expect(options[1].attributes('data-active')).toBe('true')
  })
})

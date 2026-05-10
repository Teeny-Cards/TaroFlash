import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { reactive, defineComponent, h } from 'vue'
import CardDesignerToolbar from '@/components/modals/deck-settings/tab-design/card-designer-toolbar.vue'

// ── Stubs ──────────────────────────────────────────────────────────────────────

const PickerPopoverStub = defineComponent({
  name: 'PickerPopover',
  props: ['label', 'icon'],
  setup(_props, { slots }) {
    return () => h('div', { 'data-testid': 'popover-stub' }, slots.default?.())
  }
})

const UiSpinboxStub = defineComponent({
  name: 'UiSpinbox',
  props: ['value', 'min', 'max', 'step', 'size', 'suffix'],
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('button', {
        'data-testid': 'ui-kit-spinbox-stub',
        'data-value': props.value,
        'data-min': props.min,
        'data-max': props.max,
        'data-step': props.step,
        onClick: () => emit('update:value', (props.value ?? 0) + 1)
      })
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeToolbar(initial = {}) {
  const attributes = reactive(initial)
  const wrapper = shallowMount(CardDesignerToolbar, {
    props: { attributes },
    global: {
      stubs: { PickerPopover: PickerPopoverStub, UiSpinbox: UiSpinboxStub }
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

  test('renders two popovers (h-align, v-align)', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.findAll('[data-testid="popover-stub"]')).toHaveLength(2)
  })

  // ── Text size spinbox ──────────────────────────────────────────────────────

  test('renders the text size spinbox inline (not inside a popover)', () => {
    const { wrapper } = makeToolbar()
    const spinbox = wrapper.findComponent({ name: 'UiSpinbox' })
    expect(spinbox.exists()).toBe(true)
  })

  test('spinbox is configured with min=1, max=10, step=1', () => {
    const { wrapper } = makeToolbar()
    const spinbox = wrapper.findComponent({ name: 'UiSpinbox' })
    expect(spinbox.props('min')).toBe(1)
    expect(spinbox.props('max')).toBe(10)
    expect(spinbox.props('step')).toBe(1)
  })

  test('spinbox value defaults to level 4 when text_size unset', () => {
    const { wrapper } = makeToolbar()
    const spinbox = wrapper.findComponent({ name: 'UiSpinbox' })
    expect(spinbox.props('value')).toBe(4)
  })

  test('spinbox value reflects existing text_size on attributes', () => {
    const { wrapper } = makeToolbar({ text_size: 7 })
    const spinbox = wrapper.findComponent({ name: 'UiSpinbox' })
    expect(spinbox.props('value')).toBe(7)
  })

  test('spinbox update:value writes back to attributes.text_size', async () => {
    const { wrapper, attributes } = makeToolbar({ text_size: 4 })
    const spinbox = wrapper.findComponent({ name: 'UiSpinbox' })
    await spinbox.vm.$emit('update:value', 8)
    expect(attributes.text_size).toBe(8)
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

  test('re-clicking the active horizontal option does not change attributes', async () => {
    const { wrapper, attributes } = makeToolbar({ horizontal_alignment: 'left' })
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__h-align-option"]')
    await options[0].trigger('click')
    expect(attributes.horizontal_alignment).toBe('left')
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

  test('re-clicking the active vertical option does not change attributes', async () => {
    const { wrapper, attributes } = makeToolbar({ vertical_alignment: 'top' })
    const options = wrapper.findAll('[data-testid="card-designer-toolbar__v-align-option"]')
    await options[0].trigger('click')
    expect(attributes.vertical_alignment).toBe('top')
  })
})

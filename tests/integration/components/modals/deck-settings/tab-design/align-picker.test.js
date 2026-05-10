import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AlignPicker from '@/components/modals/deck-settings/tab-design/align-picker.vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const PickerPopoverStub = defineComponent({
  name: 'PickerPopover',
  props: ['label', 'icon'],
  setup(_props, { slots }) {
    return () => h('div', { 'data-testid': 'popover-stub' }, slots.default?.())
  }
})

const UiIconStub = defineComponent({
  name: 'UiIcon',
  props: ['src'],
  setup(p) {
    return () => h('span', { 'data-testid': 'ui-icon', 'data-src': p.src })
  }
})

function makePicker(props = {}) {
  let model = props.value
  const wrapper = mount(AlignPicker, {
    props: {
      axis: 'horizontal',
      ...props,
      'onUpdate:value': (v) => {
        model = v
        wrapper.setProps({ value: v })
      }
    },
    global: {
      stubs: { PickerPopover: PickerPopoverStub, UiIcon: UiIconStub },
      mocks: { $t: (k) => k }
    }
  })
  return { wrapper, getValue: () => model }
}

describe('AlignPicker', () => {
  beforeEach(() => mockEmitSfx.mockClear())

  // ── Horizontal ─────────────────────────────────────────────────────────────

  test('renders 3 horizontal options', () => {
    const { wrapper } = makePicker({ axis: 'horizontal' })
    expect(wrapper.findAll('[data-testid="align-picker__horizontal-option"]')).toHaveLength(3)
  })

  test('defaults the active horizontal option to center when value is unset', () => {
    const { wrapper } = makePicker({ axis: 'horizontal' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    expect(options[1].attributes('data-active')).toBe('true')
    expect(options[0].attributes('data-active')).toBe('false')
    expect(options[2].attributes('data-active')).toBe('false')
  })

  test('marks the active horizontal option from the model value', () => {
    const { wrapper } = makePicker({ axis: 'horizontal', value: 'right' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    expect(options[2].attributes('data-active')).toBe('true')
    expect(options[0].attributes('data-active')).toBe('false')
  })

  test('clicking a horizontal option emits update:value with that value', async () => {
    const { wrapper, getValue } = makePicker({ axis: 'horizontal' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    await options[0].trigger('click')
    expect(getValue()).toBe('left')
  })

  test('clicking the active horizontal option does not change the value', async () => {
    const { wrapper, getValue } = makePicker({ axis: 'horizontal', value: 'left' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    await options[0].trigger('click')
    expect(getValue()).toBe('left')
  })

  // ── Vertical ───────────────────────────────────────────────────────────────

  test('renders 3 vertical options', () => {
    const { wrapper } = makePicker({ axis: 'vertical' })
    expect(wrapper.findAll('[data-testid="align-picker__vertical-option"]')).toHaveLength(3)
  })

  test('defaults the active vertical option to center when value is unset', () => {
    const { wrapper } = makePicker({ axis: 'vertical' })
    const options = wrapper.findAll('[data-testid="align-picker__vertical-option"]')
    expect(options[1].attributes('data-active')).toBe('true')
  })

  test('clicking a vertical option emits update:value with that value', async () => {
    const { wrapper, getValue } = makePicker({ axis: 'vertical' })
    const options = wrapper.findAll('[data-testid="align-picker__vertical-option"]')
    await options[2].trigger('click')
    expect(getValue()).toBe('bottom')
  })

  // ── SFX ────────────────────────────────────────────────────────────────────

  test('plays select sfx when changing to a new value', async () => {
    const { wrapper } = makePicker({ axis: 'horizontal', value: 'left' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    await options[2].trigger('click')
    expect(mockEmitSfx).toHaveBeenCalledWith('ui.etc_camera_shutter')
  })

  test('plays reselect sfx when clicking the active value', async () => {
    const { wrapper } = makePicker({ axis: 'horizontal', value: 'left' })
    const options = wrapper.findAll('[data-testid="align-picker__horizontal-option"]')
    await options[0].trigger('click')
    expect(mockEmitSfx).toHaveBeenCalledWith('ui.digi_powerdown')
  })
})

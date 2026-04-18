import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import BgColorPicker from '@/components/modals/deck-settings/cover-designer/bg-color-picker.vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const PickerPopoverStub = defineComponent({
  name: 'PickerPopover',
  props: ['label', 'icon', 'size'],
  setup(_props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'picker-popover-stub' }, [slots.default?.(), slots.extra?.()])
  }
})

const UiSliderStub = defineComponent({
  name: 'UiSlider',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', {
        'data-testid': 'ui-slider-stub',
        'data-value': String(props.modelValue),
        onClick: () => emit('update:modelValue', 75)
      })
  }
})

const DEFAULT_THEMES = ['blue-500', 'green-400', 'purple-500', 'pink-400', 'red-500', 'orange-500']

function makePicker(props = {}) {
  return shallowMount(BgColorPicker, {
    props: {
      supported_themes: DEFAULT_THEMES,
      bg_color: undefined,
      border_size: undefined,
      ...props
    },
    global: {
      stubs: { PickerPopover: PickerPopoverStub, UiSlider: UiSliderStub },
      directives: { sfx: {} }
    }
  })
}

beforeEach(() => {
  mockEmitSfx.mockClear()
})

describe('BgColorPicker', () => {
  test('renders one button per supported theme', () => {
    const wrapper = makePicker()
    DEFAULT_THEMES.forEach((theme) => {
      const btn = wrapper.find(`[data-testid="bg-color-picker__option-${theme}"]`)
      expect(btn.exists()).toBe(true)
      expect(btn.attributes('data-theme')).toBe(theme)
    })
  })

  test('clicking an unselected theme emits update:bg_color with that theme', async () => {
    const wrapper = makePicker({ bg_color: 'blue-500' })
    await wrapper.find('[data-testid="bg-color-picker__option-green-400"]').trigger('click')

    expect(wrapper.emitted('update:bg_color')).toEqual([['green-400']])
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('clicking the already-selected theme does not emit update:bg_color', async () => {
    const wrapper = makePicker({ bg_color: 'blue-500' })
    await wrapper.find('[data-testid="bg-color-picker__option-blue-500"]').trigger('click')

    expect(wrapper.emitted('update:bg_color')).toBeUndefined()
    // Still plays a sound (powerdown) on the no-op
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('renders the border slider in the extra slot', () => {
    const wrapper = makePicker({ border_size: 8 })
    expect(wrapper.find('[data-testid="bg-color-picker__border"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="ui-slider-stub"]').exists()).toBe(true)
  })

  test('slider reports 25% when border_size is undefined', () => {
    const wrapper = makePicker({ border_size: undefined })
    expect(wrapper.find('[data-testid="ui-slider-stub"]').attributes('data-value')).toBe('25')
  })

  test('slider maps border_size to the matching percent of its 1..16 range', () => {
    // 8 within [1..16] → (8-1)/15 ≈ 0.4667 → 47%
    const wrapper = makePicker({ border_size: 8 })
    expect(wrapper.find('[data-testid="ui-slider-stub"]').attributes('data-value')).toBe('47')
  })

  test('changing the slider emits update:border_size mapped back into the 1..16 range', async () => {
    const wrapper = makePicker({ border_size: 1 })
    // UiSliderStub emits modelValue = 75 on click
    await wrapper.find('[data-testid="ui-slider-stub"]').trigger('click')

    // 1 + (75/100) * 15 = 12.25 → round → 12
    expect(wrapper.emitted('update:border_size')).toEqual([[12]])
  })
})

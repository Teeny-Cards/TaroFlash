import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import PatternPicker from '@/components/modals/deck-settings/cover-designer/pattern-picker.vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const PickerPopoverStub = defineComponent({
  name: 'PickerPopover',
  props: ['label', 'icon', 'size'],
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'picker-popover-stub', 'data-size': props.size }, slots.default?.())
  }
})

const SUPPORTED_PATTERNS = ['diagonal-stripes', 'wave', 'aztec']

function makePicker(props = {}) {
  return shallowMount(PatternPicker, {
    props: {
      supported_patterns: SUPPORTED_PATTERNS,
      selected_pattern: undefined,
      pattern_size: undefined,
      ...props
    },
    global: {
      stubs: { PickerPopover: PickerPopoverStub },
      directives: { sfx: {} }
    }
  })
}

beforeEach(() => {
  mockEmitSfx.mockClear()
})

describe('PatternPicker', () => {
  test('renders one option per supported pattern plus the none button', () => {
    const wrapper = makePicker()
    SUPPORTED_PATTERNS.forEach((pattern) => {
      expect(wrapper.find(`[data-testid="pattern-picker__option-${pattern}"]`).exists()).toBe(true)
    })
    expect(wrapper.find('[data-testid="pattern-picker__none"]').exists()).toBe(true)
  })

  test('passes size="lg" to the popover wrapper', () => {
    const wrapper = makePicker()
    expect(wrapper.find('[data-testid="picker-popover-stub"]').attributes('data-size')).toBe('lg')
  })

  test('marks the selected pattern with data-selected', () => {
    const wrapper = makePicker({ selected_pattern: 'wave' })
    expect(
      wrapper.find('[data-testid="pattern-picker__option-wave"]').attributes('data-selected')
    ).toBe('true')
    expect(
      wrapper
        .find('[data-testid="pattern-picker__option-diagonal-stripes"]')
        .attributes('data-selected')
    ).toBeUndefined()
  })

  test('marks the none button as selected when no pattern is chosen', () => {
    const wrapper = makePicker({ selected_pattern: undefined })
    expect(wrapper.find('[data-testid="pattern-picker__none"]').attributes('data-selected')).toBe(
      'true'
    )
  })

  test('clicking an unselected pattern emits update:pattern', async () => {
    const wrapper = makePicker({ selected_pattern: 'wave' })
    await wrapper.find('[data-testid="pattern-picker__option-aztec"]').trigger('click')

    expect(wrapper.emitted('update:pattern')).toEqual([['aztec']])
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('clicking the already-selected pattern does not emit', async () => {
    const wrapper = makePicker({ selected_pattern: 'wave' })
    await wrapper.find('[data-testid="pattern-picker__option-wave"]').trigger('click')

    expect(wrapper.emitted('update:pattern')).toBeUndefined()
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('clicking the none button emits update:pattern with undefined', async () => {
    const wrapper = makePicker({ selected_pattern: 'wave' })
    await wrapper.find('[data-testid="pattern-picker__none"]').trigger('click')

    expect(wrapper.emitted('update:pattern')).toEqual([[undefined]])
  })

  test('swatches set --bgx-size only when pattern_size is provided', () => {
    const withoutSize = makePicker({ pattern_size: undefined })
    const withSize = makePicker({ pattern_size: 50 })

    const unsizedSwatch = withoutSize.find('[data-testid="pattern-picker__option-aztec"]')
    const sizedSwatch = withSize.find('[data-testid="pattern-picker__option-aztec"]')

    expect(unsizedSwatch.attributes('style') || '').not.toContain('--bgx-size')
    expect(sizedSwatch.attributes('style') || '').toContain('--bgx-size')
  })
})

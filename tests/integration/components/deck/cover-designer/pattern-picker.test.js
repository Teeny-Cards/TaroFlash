import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import PatternPicker from '@/components/deck/cover-designer/pattern-picker.vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const SUPPORTED_PATTERNS = ['diagonal-stripes', 'wave', 'aztec']

function makePicker(props = {}) {
  return shallowMount(PatternPicker, {
    props: {
      supported_patterns: SUPPORTED_PATTERNS,
      selected_pattern: undefined,
      ...props
    },
    global: {
      directives: { sfx: {} }
    }
  })
}

beforeEach(() => {
  mockEmitSfx.mockClear()
})

describe('PatternPicker', () => {
  test('renders one option per supported pattern', () => {
    const wrapper = makePicker()
    SUPPORTED_PATTERNS.forEach((pattern) => {
      expect(wrapper.find(`[data-testid="pattern-picker__option-${pattern}"]`).exists()).toBe(true)
    })
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
    // Still plays the powerdown sfx on the no-op.
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('swatches set --bgx-size from the static patternSize helper', () => {
    const wrapper = makePicker()
    const swatch = wrapper.find('[data-testid="pattern-picker__option-aztec"]')
    expect(swatch.attributes('style') || '').toContain('--bgx-size')
  })
})

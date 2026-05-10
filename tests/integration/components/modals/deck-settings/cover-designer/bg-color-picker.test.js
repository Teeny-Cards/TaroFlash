import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import BgColorPicker from '@/components/modals/deck-settings/tab-design/cover-designer/bg-color-picker.vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const DEFAULT_THEMES = [
  { light: 'blue-500', dark: 'blue-800' },
  { light: 'green-400', dark: 'green-500' },
  { light: 'pink-400' },
  { light: 'red-500' }
]

function makePicker(props = {}) {
  return shallowMount(BgColorPicker, {
    props: {
      supported_themes: DEFAULT_THEMES,
      bg_color: undefined,
      bg_color_dark: undefined,
      border_size: undefined,
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

describe('BgColorPicker', () => {
  test('renders one button per supported theme option', () => {
    const wrapper = makePicker()
    DEFAULT_THEMES.forEach((option) => {
      const btn = wrapper.find(`[data-testid="bg-color-picker__option-${option.light}"]`)
      expect(btn.exists()).toBe(true)
      expect(btn.attributes('data-theme')).toBe(option.light)
    })
  })

  test('forwards each option dark variant onto data-theme-dark', () => {
    const wrapper = makePicker()
    const blueBtn = wrapper.find('[data-testid="bg-color-picker__option-blue-500"]')
    expect(blueBtn.attributes('data-theme-dark')).toBe('blue-800')
  })

  test('omits data-theme-dark when an option has no dark variant', () => {
    const wrapper = makePicker()
    const pinkBtn = wrapper.find('[data-testid="bg-color-picker__option-pink-400"]')
    expect(pinkBtn.attributes('data-theme-dark')).toBeUndefined()
  })

  test('clicking an unselected option emits paired update events', async () => {
    const wrapper = makePicker({ bg_color: 'blue-500', bg_color_dark: 'blue-800' })
    await wrapper.find('[data-testid="bg-color-picker__option-green-400"]').trigger('click')

    expect(wrapper.emitted('update:bg_color')).toEqual([['green-400']])
    expect(wrapper.emitted('update:bg_color_dark')).toEqual([['green-500']])
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('clicking an option without a dark variant emits undefined for the dark slot', async () => {
    const wrapper = makePicker({ bg_color: 'blue-500', bg_color_dark: 'blue-800' })
    await wrapper.find('[data-testid="bg-color-picker__option-pink-400"]').trigger('click')

    expect(wrapper.emitted('update:bg_color')).toEqual([['pink-400']])
    expect(wrapper.emitted('update:bg_color_dark')).toEqual([[undefined]])
  })

  test('clicking the already-selected pair does not emit update events', async () => {
    const wrapper = makePicker({ bg_color: 'blue-500', bg_color_dark: 'blue-800' })
    await wrapper.find('[data-testid="bg-color-picker__option-blue-500"]').trigger('click')

    expect(wrapper.emitted('update:bg_color')).toBeUndefined()
    expect(wrapper.emitted('update:bg_color_dark')).toBeUndefined()
    // Still plays a sound (powerdown) on the no-op
    expect(mockEmitSfx).toHaveBeenCalledTimes(1)
  })

  test('matching the light value but mismatching the dark value is not selected', async () => {
    // Same bg_color, but the option's dark differs from the prop.
    const wrapper = makePicker({ bg_color: 'pink-400', bg_color_dark: 'pink-700' })
    await wrapper.find('[data-testid="bg-color-picker__option-pink-400"]').trigger('click')

    // Treated as a fresh selection — both update events fire.
    expect(wrapper.emitted('update:bg_color')).toEqual([['pink-400']])
    expect(wrapper.emitted('update:bg_color_dark')).toEqual([[undefined]])
  })
})

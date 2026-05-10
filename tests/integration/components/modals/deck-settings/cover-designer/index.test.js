import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { reactive, defineComponent, h } from 'vue'
import CoverDesigner from '@/components/modals/deck-settings/tab-design/cover-designer/index.vue'

function slotlessStub(name) {
  return defineComponent({
    name,
    inheritAttrs: true,
    props: {
      supported_themes: { type: Array, default: () => [] },
      supported_icons: { type: Array, default: () => [] },
      supported_patterns: { type: Array, default: () => [] },
      bg_color: { default: undefined },
      border_size: { default: undefined },
      icon: { default: undefined },
      selected_pattern: { default: undefined },
      pattern_size: { default: undefined }
    },
    setup(props) {
      return () => h('div', { 'data-testid': `${name}-stub`, 'data-props': JSON.stringify(props) })
    }
  })
}

const BgColorPickerStub = slotlessStub('BgColorPicker')
const IconPickerStub = slotlessStub('IconPicker')
const PatternPickerStub = slotlessStub('PatternPicker')

const SectionListStub = defineComponent({
  name: 'SectionList',
  setup(_p, { slots }) {
    return () => h('div', { 'data-testid': 'section-list-stub' }, slots.default?.())
  }
})

function makeDesigner(initial = {}) {
  const config = reactive(initial)
  const wrapper = shallowMount(CoverDesigner, {
    props: { config },
    global: {
      stubs: {
        BgColorPicker: BgColorPickerStub,
        IconPicker: IconPickerStub,
        PatternPicker: PatternPickerStub,
        SectionList: SectionListStub
      }
    }
  })
  return { wrapper, config }
}

describe('CoverDesigner toolbar', () => {
  test('renders all three pickers', () => {
    const { wrapper } = makeDesigner()
    expect(wrapper.find('[data-testid="cover-designer-toolbar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="BgColorPicker-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="IconPicker-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="PatternPicker-stub"]').exists()).toBe(true)
  })

  test('forwards config fields to the appropriate picker', () => {
    const { wrapper } = makeDesigner({
      bg_color: 'pink-400',
      border_size: 8,
      icon: 'book',
      pattern: 'wave',
      pattern_size: 50
    })

    const bg = wrapper.findComponent(BgColorPickerStub).props()
    expect(bg.bg_color).toBe('pink-400')
    expect(bg.border_size).toBe(8)
    expect(bg.supported_themes.map((option) => option.light)).toEqual(
      expect.arrayContaining(['blue-500', 'green-500', 'purple-500'])
    )

    const iconProps = wrapper.findComponent(IconPickerStub).props()
    expect(iconProps.icon).toBe('book')
    expect(iconProps.supported_icons).toEqual(expect.arrayContaining(['card-deck', 'book']))

    const patternProps = wrapper.findComponent(PatternPickerStub).props()
    expect(patternProps.selected_pattern).toBe('wave')
    expect(patternProps.pattern_size).toBe(50)
    expect(patternProps.supported_patterns).toEqual(expect.arrayContaining(['wave', 'aztec']))
  })

  test('update:bg_color from BgColorPicker mutates config.bg_color', async () => {
    const { wrapper, config } = makeDesigner({ bg_color: 'blue-500' })
    wrapper.findComponent(BgColorPickerStub).vm.$emit('update:bg_color', 'red-500')
    await wrapper.vm.$nextTick()
    expect(config.bg_color).toBe('red-500')
  })

  test('update:border_size from BgColorPicker mutates config.border_size', async () => {
    const { wrapper, config } = makeDesigner({ border_size: 2 })
    wrapper.findComponent(BgColorPickerStub).vm.$emit('update:border_size', 12)
    await wrapper.vm.$nextTick()
    expect(config.border_size).toBe(12)
  })

  test('update:icon from IconPicker mutates config.icon', async () => {
    const { wrapper, config } = makeDesigner()
    wrapper.findComponent(IconPickerStub).vm.$emit('update:icon', 'store')
    await wrapper.vm.$nextTick()
    expect(config.icon).toBe('store')
  })

  test('update:pattern from PatternPicker mutates config.pattern', async () => {
    const { wrapper, config } = makeDesigner({ pattern: 'wave' })
    wrapper.findComponent(PatternPickerStub).vm.$emit('update:pattern', 'aztec')
    await wrapper.vm.$nextTick()
    expect(config.pattern).toBe('aztec')
  })
})

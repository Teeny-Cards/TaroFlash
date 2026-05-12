import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'
import TabSounds from '@/phone/apps/settings/component/tab-sounds/index.vue'

const SliderStub = defineComponent({
  name: 'UiSlider',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', { ...attrs, 'data-testid': 'slider-stub' }, slots.default?.())
  }
})

function makeTab() {
  return mount(TabSounds, {
    global: {
      stubs: { UiSlider: SliderStub },
      mocks: { $t: (k) => k }
    }
  })
}

describe('TabSounds', () => {
  test('renders the sounds container with three sliders', () => {
    const wrapper = makeTab()
    expect(wrapper.find('[data-testid="tab-sounds"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="slider-stub"]')).toHaveLength(3)
  })
})

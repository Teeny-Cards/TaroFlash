import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'
import TabStudy from '@/components/modals/deck-settings/tab-study.vue'

// Render-function stubs (no template strings — Chromium browser mode is
// runtime-only Vue).
const ToggleStub = defineComponent({
  name: 'UiToggle',
  props: { checked: { type: Boolean, default: false } },
  emits: ['update:checked'],
  inheritAttrs: false,
  setup(props, { slots, emit }) {
    const attrs = useAttrs()
    return () =>
      h(
        'label',
        { ...attrs, 'data-testid': 'ui-kit-toggle', 'data-checked': String(!!props.checked) },
        [
          h('span', { 'data-testid': 'ui-kit-toggle__label' }, slots.default?.()),
          h('input', {
            type: 'checkbox',
            checked: !!props.checked,
            'data-testid': 'ui-kit-toggle__input',
            onChange: (e) => emit('update:checked', e.target.checked)
          })
        ]
      )
  }
})

const IconStub = defineComponent({
  name: 'UiIcon',
  props: ['src'],
  setup(p) {
    return () => h('span', { 'data-testid': 'ui-icon', 'data-src': p.src })
  }
})

function makeTabStudy(props = {}) {
  return mount(TabStudy, {
    props,
    global: {
      stubs: { UiToggle: ToggleStub, UiIcon: IconStub },
      mocks: { $t: (k) => k }
    }
  })
}

describe('TabStudy', () => {
  test('renders all four toggles', () => {
    const wrapper = makeTabStudy()
    expect(wrapper.findAll('[data-testid="ui-kit-toggle"]')).toHaveLength(4)
  })

  test('renders 5 review-limit + 5 new-limit preset buttons', () => {
    const wrapper = makeTabStudy()
    const buttons = wrapper.findAll('button')
    // 5 + 5 = 10
    expect(buttons).toHaveLength(10)
  })

  test('emits update:shuffle when shuffle toggle changes', async () => {
    const wrapper = makeTabStudy({ shuffle: false })
    const toggles = wrapper.findAllComponents(ToggleStub)
    // Order: is_spaced, shuffle, flip_cards, auto_play
    await toggles[1].vm.$emit('update:checked', true)
    expect(wrapper.emitted('update:shuffle')).toEqual([[true]])
  })

  test('emits update:flip_cards from the flip-cards toggle', async () => {
    const wrapper = makeTabStudy({ flip_cards: false })
    const toggles = wrapper.findAllComponents(ToggleStub)
    await toggles[2].vm.$emit('update:checked', true)
    expect(wrapper.emitted('update:flip_cards')).toEqual([[true]])
  })

  test('emits update:is_spaced from the spaced-repetition toggle', async () => {
    const wrapper = makeTabStudy({ is_spaced: true })
    const toggles = wrapper.findAllComponents(ToggleStub)
    await toggles[0].vm.$emit('update:checked', false)
    expect(wrapper.emitted('update:is_spaced')).toEqual([[false]])
  })

  test('emits update:auto_play from the auto-play toggle', async () => {
    const wrapper = makeTabStudy({ auto_play: false })
    const toggles = wrapper.findAllComponents(ToggleStub)
    await toggles[3].vm.$emit('update:checked', true)
    expect(wrapper.emitted('update:auto_play')).toEqual([[true]])
  })

  test('clicking a review-limit preset emits update:max_reviews_per_day with that value', async () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 20 })
    const buttons = wrapper.findAll('button')
    // First 5 buttons = review-limit presets [20, 50, 100, 200, null]
    await buttons[2].trigger('click')
    expect(wrapper.emitted('update:max_reviews_per_day')).toEqual([[100]])
  })

  test('clicking the "all" review-limit preset emits null', async () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 50 })
    const buttons = wrapper.findAll('button')
    await buttons[4].trigger('click')
    expect(wrapper.emitted('update:max_reviews_per_day')).toEqual([[null]])
  })

  test('clicking a new-limit preset emits update:max_new_per_day with that value', async () => {
    const wrapper = makeTabStudy({ max_new_per_day: 5 })
    const buttons = wrapper.findAll('button')
    // Buttons 5–9 = new-limit presets [5, 10, 20, 50, null]
    await buttons[6].trigger('click')
    expect(wrapper.emitted('update:max_new_per_day')).toEqual([[10]])
  })

  test('clicking the "all" new-limit preset emits null', async () => {
    const wrapper = makeTabStudy({ max_new_per_day: 10 })
    const buttons = wrapper.findAll('button')
    await buttons[9].trigger('click')
    expect(wrapper.emitted('update:max_new_per_day')).toEqual([[null]])
  })

  test('marks the active review-limit preset via data-active', () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 100 })
    const presets = wrapper.findAll('[data-testid="tab-study__max-reviews-preset"]')
    expect(presets[2].attributes('data-active')).toBe('true')
    expect(presets[0].attributes('data-active')).toBe('false')
  })

  test('marks the active new-limit preset via data-active', () => {
    const wrapper = makeTabStudy({ max_new_per_day: 20 })
    const presets = wrapper.findAll('[data-testid="tab-study__max-new-preset"]')
    expect(presets[2].attributes('data-active')).toBe('true')
    expect(presets[0].attributes('data-active')).toBe('false')
  })
})

import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'
import TabStudy from '@/components/modals/deck-settings/tab-study.vue'

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
        {
          'data-testid': 'ui-kit-toggle',
          'data-checked': String(!!props.checked),
          ...attrs
        },
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

const SpinboxStub = defineComponent({
  name: 'UiSpinbox',
  props: {
    value: { type: Number, required: true },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    step: { type: Number, default: 1 }
  },
  emits: ['update:value'],
  inheritAttrs: false,
  setup(props, { emit }) {
    const attrs = useAttrs()
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-testid': 'ui-kit-spinbox',
          'data-value': String(props.value),
          'data-min': String(props.min),
          'data-max': String(props.max),
          'data-step': String(props.step)
        },
        [
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'ui-kit-spinbox__decrement',
              onClick: () => emit('update:value', Math.max(props.min, props.value - props.step))
            },
            '-'
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'ui-kit-spinbox__increment',
              onClick: () => emit('update:value', Math.min(props.max, props.value + props.step))
            },
            '+'
          )
        ]
      )
  }
})

function makeTabStudy(props = {}) {
  return mount(TabStudy, {
    props,
    global: {
      stubs: { UiToggle: ToggleStub, UiIcon: IconStub, UiSpinbox: SpinboxStub },
      mocks: { $t: (k) => k }
    }
  })
}

describe('TabStudy', () => {
  test('renders four behavior toggles plus two "all" toggles', () => {
    const wrapper = makeTabStudy()
    expect(wrapper.findAllComponents(ToggleStub)).toHaveLength(6)
  })

  test('renders a spinbox for each daily limit', () => {
    const wrapper = makeTabStudy()
    expect(wrapper.findAll('[data-testid="ui-kit-spinbox"]')).toHaveLength(2)
  })

  test('emits update:shuffle when shuffle toggle changes', async () => {
    const wrapper = makeTabStudy({ shuffle: false })
    const toggles = wrapper.findAllComponents(ToggleStub)
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

  test('reviews spinbox is configured: step 5, min 5, max 200', () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 50 })
    const spinbox = wrapper.find(
      '[data-testid="tab-study__max-reviews-row"] [data-testid="ui-kit-spinbox"]'
    )
    expect(spinbox.attributes('data-step')).toBe('5')
    expect(spinbox.attributes('data-min')).toBe('5')
    expect(spinbox.attributes('data-max')).toBe('200')
    expect(spinbox.attributes('data-value')).toBe('50')
  })

  test('new spinbox is configured: step 5, min 5, max 100', () => {
    const wrapper = makeTabStudy({ max_new_per_day: 10 })
    const spinbox = wrapper.find(
      '[data-testid="tab-study__max-new-row"] [data-testid="ui-kit-spinbox"]'
    )
    expect(spinbox.attributes('data-step')).toBe('5')
    expect(spinbox.attributes('data-min')).toBe('5')
    expect(spinbox.attributes('data-max')).toBe('100')
    expect(spinbox.attributes('data-value')).toBe('10')
  })

  test('incrementing reviews spinbox emits update:max_reviews_per_day with stepped value', async () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 50 })
    await wrapper
      .find('[data-testid="tab-study__max-reviews-row"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    expect(wrapper.emitted('update:max_reviews_per_day')).toEqual([[55]])
  })

  test('reaching reviews max emits null (switches to all)', async () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 195 })
    await wrapper
      .find('[data-testid="tab-study__max-reviews-row"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    const emitted = wrapper.emitted('update:max_reviews_per_day')
    expect(emitted[emitted.length - 1]).toEqual([null])
  })

  test('reaching new-per-day max emits null (switches to all)', async () => {
    const wrapper = makeTabStudy({ max_new_per_day: 95 })
    await wrapper
      .find('[data-testid="tab-study__max-new-row"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    const emitted = wrapper.emitted('update:max_new_per_day')
    expect(emitted[emitted.length - 1]).toEqual([null])
  })

  test('toggling the reviews "all" toggle on emits null', async () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: 50 })
    const allToggle = wrapper.find('[data-testid="tab-study__max-reviews-all"]')
    await allToggle.find('input').setValue(true)
    expect(wrapper.emitted('update:max_reviews_per_day')).toEqual([[null]])
  })

  test('toggling the new "all" toggle off restores a numeric value', async () => {
    const wrapper = makeTabStudy({ max_new_per_day: null })
    const allToggle = wrapper.find('[data-testid="tab-study__max-new-all"]')
    await allToggle.find('input').setValue(false)
    const emitted = wrapper.emitted('update:max_new_per_day')
    expect(typeof emitted[0][0]).toBe('number')
    expect(emitted[0][0]).toBeGreaterThan(0)
  })

  test('the "all" toggles reflect null state via data-checked', () => {
    const wrapper = makeTabStudy({ max_reviews_per_day: null, max_new_per_day: 20 })
    const reviewsAll = wrapper.find('[data-testid="tab-study__max-reviews-all"]')
    const newAll = wrapper.find('[data-testid="tab-study__max-new-all"]')
    expect(reviewsAll.attributes('data-checked')).toBe('true')
    expect(newAll.attributes('data-checked')).toBe('false')
  })
})

import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, reactive, useAttrs } from 'vue'
import TabStudy from '@/components/modals/deck-settings/tab-study/index.vue'

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

function makeTabStudy({ config: initial = {}, card_count } = {}) {
  const config = reactive({ ...initial })
  const wrapper = mount(TabStudy, {
    props: {
      config,
      card_count,
      'onUpdate:config': (next) => Object.assign(config, next)
    },
    global: {
      stubs: { UiToggle: ToggleStub, UiIcon: IconStub, UiSpinbox: SpinboxStub },
      mocks: { $t: (k) => k }
    }
  })
  return { wrapper, config }
}

function rowSpinbox(wrapper, row) {
  return wrapper.find(`[data-testid="${row}"] [data-testid="ui-kit-spinbox"]`)
}

function rowAllToggle(wrapper, row) {
  return wrapper.find(`[data-testid="${row}"] [data-testid="capped-spinbox-row__all-toggle"]`)
}

describe('TabStudy', () => {
  test('renders four behavior toggles plus two "all" toggles', () => {
    const { wrapper } = makeTabStudy()
    expect(wrapper.findAllComponents(ToggleStub)).toHaveLength(6)
  })

  test('renders a spinbox for each daily limit', () => {
    const { wrapper } = makeTabStudy()
    expect(wrapper.findAll('[data-testid="ui-kit-spinbox"]')).toHaveLength(2)
  })

  test('updates config.shuffle when shuffle toggle changes', async () => {
    const { wrapper, config } = makeTabStudy({ config: { shuffle: false } })
    const toggles = wrapper.findAllComponents(ToggleStub)
    toggles[1].vm.$emit('update:checked', true)
    await wrapper.vm.$nextTick()
    expect(config.shuffle).toBe(true)
  })

  test('updates config.flip_cards from the flip-cards toggle', async () => {
    const { wrapper, config } = makeTabStudy({ config: { flip_cards: false } })
    const toggles = wrapper.findAllComponents(ToggleStub)
    toggles[2].vm.$emit('update:checked', true)
    await wrapper.vm.$nextTick()
    expect(config.flip_cards).toBe(true)
  })

  test('updates config.is_spaced from the spaced-repetition toggle', async () => {
    const { wrapper, config } = makeTabStudy({ config: { is_spaced: true } })
    const toggles = wrapper.findAllComponents(ToggleStub)
    toggles[0].vm.$emit('update:checked', false)
    await wrapper.vm.$nextTick()
    expect(config.is_spaced).toBe(false)
  })

  test('updates config.auto_play from the auto-play toggle', async () => {
    const { wrapper, config } = makeTabStudy({ config: { auto_play: false } })
    const toggles = wrapper.findAllComponents(ToggleStub)
    toggles[3].vm.$emit('update:checked', true)
    await wrapper.vm.$nextTick()
    expect(config.auto_play).toBe(true)
  })

  test('reviews spinbox is configured: step 5, min 5, max 200', () => {
    const { wrapper } = makeTabStudy({ config: { max_reviews_per_day: 50 } })
    const spinbox = rowSpinbox(wrapper, 'tab-study__max-reviews')
    expect(spinbox.attributes('data-step')).toBe('5')
    expect(spinbox.attributes('data-min')).toBe('5')
    expect(spinbox.attributes('data-max')).toBe('200')
    expect(spinbox.attributes('data-value')).toBe('50')
  })

  test('new spinbox is configured: step 5, min 5, max 100', () => {
    const { wrapper } = makeTabStudy({ config: { max_new_per_day: 10 } })
    const spinbox = rowSpinbox(wrapper, 'tab-study__max-new')
    expect(spinbox.attributes('data-step')).toBe('5')
    expect(spinbox.attributes('data-min')).toBe('5')
    expect(spinbox.attributes('data-max')).toBe('100')
    expect(spinbox.attributes('data-value')).toBe('10')
  })

  test('incrementing reviews spinbox writes a stepped value to config', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: 50 } })
    await wrapper
      .find('[data-testid="tab-study__max-reviews"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    expect(config.max_reviews_per_day).toBe(55)
  })

  test('reaching reviews max sets max_reviews_per_day to null (switches to all)', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: 195 } })
    await wrapper
      .find('[data-testid="tab-study__max-reviews"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    expect(config.max_reviews_per_day).toBeNull()
  })

  test('reaching new-per-day max sets max_new_per_day to null (switches to all)', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_new_per_day: 95 } })
    await wrapper
      .find('[data-testid="tab-study__max-new"] [data-testid="ui-kit-spinbox__increment"]')
      .trigger('click')
    expect(config.max_new_per_day).toBeNull()
  })

  test('toggling the reviews "all" toggle on sets the value to null', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: 50 } })
    await rowAllToggle(wrapper, 'tab-study__max-reviews').find('input').setValue(true)
    expect(config.max_reviews_per_day).toBeNull()
  })

  test('toggling the new "all" toggle off restores a numeric value', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_new_per_day: null } })
    await rowAllToggle(wrapper, 'tab-study__max-new').find('input').setValue(false)
    expect(typeof config.max_new_per_day).toBe('number')
    expect(config.max_new_per_day).toBeGreaterThan(0)
  })

  test('toggling reviews "all" on pre-fills the spinbox with card_count', async () => {
    const { wrapper } = makeTabStudy({
      config: { max_reviews_per_day: 50 },
      card_count: 137
    })
    await rowAllToggle(wrapper, 'tab-study__max-reviews').find('input').setValue(true)
    expect(rowSpinbox(wrapper, 'tab-study__max-reviews').attributes('data-value')).toBe('137')
  })

  test('toggling new "all" on pre-fills the spinbox with card_count', async () => {
    const { wrapper } = makeTabStudy({
      config: { max_new_per_day: 10 },
      card_count: 42
    })
    await rowAllToggle(wrapper, 'tab-study__max-new').find('input').setValue(true)
    expect(rowSpinbox(wrapper, 'tab-study__max-new').attributes('data-value')).toBe('42')
  })

  test('toggling "all" on without card_count leaves spinbox value unchanged', async () => {
    const { wrapper } = makeTabStudy({ config: { max_reviews_per_day: 50 } })
    await rowAllToggle(wrapper, 'tab-study__max-reviews').find('input').setValue(true)
    expect(rowSpinbox(wrapper, 'tab-study__max-reviews').attributes('data-value')).toBe('50')
  })

  test('toggling reviews "all" off restores the last numeric local value', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: 75 } })
    const allToggle = rowAllToggle(wrapper, 'tab-study__max-reviews')
    await allToggle.find('input').setValue(true)
    await allToggle.find('input').setValue(false)
    expect(config.max_reviews_per_day).toBe(75)
  })

  test('decrementing from null state turns "all" off and writes a numeric value', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: null } })
    await wrapper
      .find('[data-testid="tab-study__max-reviews"] [data-testid="ui-kit-spinbox__decrement"]')
      .trigger('click')
    expect(typeof config.max_reviews_per_day).toBe('number')
    expect(config.max_reviews_per_day).toBeLessThan(200)
  })

  test('external prop change to null updates the "all" toggle state', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_reviews_per_day: 50 } })
    config.max_reviews_per_day = null
    await wrapper.vm.$nextTick()
    expect(rowAllToggle(wrapper, 'tab-study__max-reviews').attributes('data-checked')).toBe('true')
  })

  test('external prop change to a number updates the spinbox value', async () => {
    const { wrapper, config } = makeTabStudy({ config: { max_new_per_day: 10 } })
    config.max_new_per_day = 80
    await wrapper.vm.$nextTick()
    expect(rowSpinbox(wrapper, 'tab-study__max-new').attributes('data-value')).toBe('80')
  })

  test('the "all" toggles reflect null state via data-checked', () => {
    const { wrapper } = makeTabStudy({
      config: { max_reviews_per_day: null, max_new_per_day: 20 }
    })
    expect(rowAllToggle(wrapper, 'tab-study__max-reviews').attributes('data-checked')).toBe('true')
    expect(rowAllToggle(wrapper, 'tab-study__max-new').attributes('data-checked')).toBe('false')
  })
})

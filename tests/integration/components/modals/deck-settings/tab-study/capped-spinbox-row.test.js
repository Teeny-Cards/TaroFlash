import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'
import CappedSpinboxRow from '@/components/modals/deck-settings/tab-study/capped-spinbox-row.vue'

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
              'data-testid': 'ui-kit-spinbox__increment',
              onClick: () => emit('update:value', Math.min(props.max, props.value + props.step))
            },
            '+'
          )
        ]
      )
  }
})

const DEFAULTS = {
  label: 'Reviews',
  all_label: 'All',
  min: 5,
  max: 200,
  step: 5,
  default_value: 50
}

function makeRow(overrides = {}) {
  const props = { ...DEFAULTS, ...overrides }
  let modelValue = props.value
  const wrapper = mount(CappedSpinboxRow, {
    props: {
      ...props,
      'onUpdate:value': (v) => {
        modelValue = v
        wrapper.setProps({ value: v })
      }
    },
    global: {
      stubs: { UiSpinbox: SpinboxStub }
    }
  })
  return { wrapper, getValue: () => modelValue }
}

describe('CappedSpinboxRow', () => {
  test('renders the label and the all-pill label', () => {
    const { wrapper } = makeRow({ label: 'Max reviews', all_label: 'Unlimited' })
    expect(wrapper.find('[data-testid="capped-spinbox-row__label"]').text()).toBe('Max reviews')
    expect(wrapper.find('[data-testid="capped-spinbox-row__all-pill"]').text()).toContain(
      'Unlimited'
    )
  })

  test('passes min/max/step through to the spinbox', () => {
    const { wrapper } = makeRow({ value: 50, min: 5, max: 200, step: 5 })
    const spinbox = wrapper.find('[data-testid="ui-kit-spinbox"]')
    expect(spinbox.attributes('data-min')).toBe('5')
    expect(spinbox.attributes('data-max')).toBe('200')
    expect(spinbox.attributes('data-step')).toBe('5')
    expect(spinbox.attributes('data-value')).toBe('50')
  })

  test('seeds spinbox from default_value when value is null', () => {
    const { wrapper } = makeRow({ value: null, default_value: 60 })
    expect(wrapper.find('[data-testid="ui-kit-spinbox"]').attributes('data-value')).toBe('60')
  })

  test('marks the all-pill active when value is null', () => {
    const { wrapper } = makeRow({ value: null })
    expect(
      wrapper.find('[data-testid="capped-spinbox-row__all-pill"]').attributes('data-active')
    ).toBe('true')
  })

  test('incrementing the spinbox emits update:value with the stepped number', async () => {
    const { wrapper, getValue } = makeRow({ value: 50, step: 5 })
    await wrapper.find('[data-testid="ui-kit-spinbox__increment"]').trigger('click')
    expect(getValue()).toBe(55)
  })

  test('reaching max emits null (switches to "all")', async () => {
    const { wrapper, getValue } = makeRow({ value: 195, step: 5, max: 200 })
    await wrapper.find('[data-testid="ui-kit-spinbox__increment"]').trigger('click')
    expect(getValue()).toBeNull()
  })

  test('clicking the all-pill from a numeric value emits null', async () => {
    const { wrapper, getValue } = makeRow({ value: 50 })
    await wrapper.find('[data-testid="capped-spinbox-row__all-pill"]').trigger('click')
    expect(getValue()).toBeNull()
  })

  test('clicking the all-pill from null restores a numeric value', async () => {
    const { wrapper, getValue } = makeRow({ value: null, default_value: 50 })
    await wrapper.find('[data-testid="capped-spinbox-row__all-pill"]').trigger('click')
    expect(typeof getValue()).toBe('number')
    expect(getValue()).toBeGreaterThan(0)
  })

  test('clicking the all-pill on with prefill_when_all sets the spinbox to that value', async () => {
    const { wrapper } = makeRow({ value: 50, prefill_when_all: 137 })
    await wrapper.find('[data-testid="capped-spinbox-row__all-pill"]').trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-spinbox"]').attributes('data-value')).toBe('137')
  })
})

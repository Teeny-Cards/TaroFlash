import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiSpinbox from '@/components/ui-kit/spinbox.vue'

function mountSpinbox(props = {}) {
  return shallowMount(UiSpinbox, { props: { value: 0, ...props } })
}

function findValue(wrapper) {
  return wrapper.find('[data-testid="ui-kit-spinbox__value"]')
}

function findInput(wrapper) {
  return wrapper.find('[data-testid="ui-kit-spinbox__input"]')
}

function findSuffix(wrapper) {
  return wrapper.find('[data-testid="ui-kit-spinbox__suffix"]')
}

function findDecrement(wrapper) {
  return wrapper.find('[data-testid="ui-kit-spinbox__decrement"]')
}

function findIncrement(wrapper) {
  return wrapper.find('[data-testid="ui-kit-spinbox__increment"]')
}

describe('UiSpinbox', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the spinbox container', () => {
    const wrapper = mountSpinbox()
    expect(wrapper.find('[data-testid="ui-kit-spinbox"]').exists()).toBe(true)
  })

  test('renders increment and decrement buttons', () => {
    const wrapper = mountSpinbox()
    expect(findIncrement(wrapper).exists()).toBe(true)
    expect(findDecrement(wrapper).exists()).toBe(true)
  })

  test('does not render label span when label prop is omitted', () => {
    const wrapper = mountSpinbox()
    expect(wrapper.find('[data-testid="ui-kit-spinbox__label"]').exists()).toBe(false)
  })

  test('renders the label span when label prop is provided', () => {
    const wrapper = mountSpinbox({ label: 'Font size' })
    const label = wrapper.find('[data-testid="ui-kit-spinbox__label"]')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Font size')
  })

  // ── Value display ──────────────────────────────────────────────────────────

  test('shows the current value in the input', () => {
    const wrapper = mountSpinbox({ value: 7 })
    expect(findInput(wrapper).element.value).toBe('7')
  })

  test('appends suffix when suffix prop is set', () => {
    const wrapper = mountSpinbox({ value: 30, suffix: 'px' })
    expect(findInput(wrapper).element.value).toBe('30')
    expect(findSuffix(wrapper).text()).toBe('px')
  })

  test('does not render suffix span when suffix is omitted', () => {
    const wrapper = mountSpinbox({ value: 30 })
    expect(findSuffix(wrapper).exists()).toBe(false)
  })

  // ── Increment / decrement (v-model) ────────────────────────────────────────

  test('clicking increment emits update:value with value + step', async () => {
    const wrapper = mountSpinbox({ value: 5, step: 1 })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[6]])
  })

  test('clicking decrement emits update:value with value - step', async () => {
    const wrapper = mountSpinbox({ value: 5, step: 1 })
    await findDecrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[4]])
  })

  test('honors a custom step value', async () => {
    const wrapper = mountSpinbox({ value: 30, step: 10 })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[40]])
  })

  // ── Bounds ─────────────────────────────────────────────────────────────────

  test('decrement button is disabled at min', () => {
    const wrapper = mountSpinbox({ value: 1, min: 1 })
    expect(findDecrement(wrapper).attributes('disabled')).toBeDefined()
  })

  test('increment button is disabled at max', () => {
    const wrapper = mountSpinbox({ value: 10, max: 10 })
    expect(findIncrement(wrapper).attributes('disabled')).toBeDefined()
  })

  test('decrement at min does not emit update:value', async () => {
    const wrapper = mountSpinbox({ value: 1, min: 1 })
    await findDecrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  test('increment at max does not emit update:value', async () => {
    const wrapper = mountSpinbox({ value: 10, max: 10 })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  test('decrement clamps to min when step would overshoot', async () => {
    const wrapper = mountSpinbox({ value: 3, min: 1, step: 10 })
    await findDecrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[1]])
  })

  test('increment clamps to max when step would overshoot', async () => {
    const wrapper = mountSpinbox({ value: 8, max: 10, step: 10 })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[10]])
  })

  // ── Wrap ───────────────────────────────────────────────────────────────────

  test('decrement at min wraps to max when wrap is enabled', async () => {
    const wrapper = mountSpinbox({ value: 1, min: 1, max: 10, wrap: true })
    await findDecrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[10]])
  })

  test('increment at max wraps to min when wrap is enabled', async () => {
    const wrapper = mountSpinbox({ value: 10, min: 1, max: 10, wrap: true })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[1]])
  })

  test('wrap keeps both buttons enabled at the bounds', () => {
    const wrapper = mountSpinbox({ value: 1, min: 1, max: 10, wrap: true })
    expect(findDecrement(wrapper).attributes('disabled')).toBeUndefined()
    expect(findIncrement(wrapper).attributes('disabled')).toBeUndefined()
  })

  // ── Defaults ──────────────────────────────────────────────────────────────

  test('with no min/max, both buttons are enabled by default', () => {
    const wrapper = mountSpinbox({ value: 0 })
    expect(findDecrement(wrapper).attributes('disabled')).toBeUndefined()
    expect(findIncrement(wrapper).attributes('disabled')).toBeUndefined()
  })

  test('default step is 1', async () => {
    const wrapper = mountSpinbox({ value: 5 })
    await findIncrement(wrapper).trigger('click')
    expect(wrapper.emitted('update:value')).toEqual([[6]])
  })
})

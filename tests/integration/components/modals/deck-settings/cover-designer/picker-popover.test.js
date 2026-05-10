import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import PickerPopover from '@/components/modals/deck-settings/tab-design/cover-designer/picker-popover.vue'

// Render-function stub for UiPopover that exposes its trigger + default slots
// inline so we can reach the trigger button and the default slot content.
const UiPopoverStub = defineComponent({
  name: 'UiPopover',
  props: ['open', 'position', 'gap', 'fallback_placements', 'shadow'],
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'ui-popover-stub', 'data-open': String(props.open) }, [
        slots.trigger?.(),
        slots.default?.()
      ])
  }
})

const UiButtonStub = defineComponent({
  name: 'UiButton',
  props: ['iconLeft', 'iconOnly', 'theme', 'themeDark', 'size', 'mobileTooltip'],
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': 'picker-popover__trigger',
          'data-icon': props.iconLeft,
          onClick: (e) => emit('click', e)
        },
        slots.default?.()
      )
  }
})

function makePopover(props = {}, slots = {}) {
  return shallowMount(PickerPopover, {
    props: { label: 'Test', ...props },
    slots,
    global: {
      stubs: { UiPopover: UiPopoverStub, UiButton: UiButtonStub },
      directives: { sfx: {} }
    }
  })
}

describe('PickerPopover', () => {
  test('renders trigger button with label text and icon prop', () => {
    const wrapper = makePopover({ label: 'Colors', icon: 'paint-brush' })
    const trigger = wrapper.find('[data-testid="picker-popover__trigger"]')
    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).toBe('Colors')
    expect(trigger.attributes('data-icon')).toBe('paint-brush')
  })

  test('renders content region with default slot', () => {
    const wrapper = makePopover({}, { default: '<span data-testid="slot-probe" />' })
    expect(wrapper.find('[data-testid="picker-popover__content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="slot-probe"]').exists()).toBe(true)
  })

  test('starts closed and opens when the trigger is clicked', async () => {
    const wrapper = makePopover()
    expect(wrapper.find('[data-testid="picker-popover"]').attributes('data-open')).toBe('false')

    await wrapper.find('[data-testid="picker-popover__trigger"]').trigger('click')
    expect(wrapper.find('[data-testid="picker-popover"]').attributes('data-open')).toBe('true')
  })

  test('toggles closed when the trigger is clicked again', async () => {
    const wrapper = makePopover()
    const trigger = wrapper.find('[data-testid="picker-popover__trigger"]')
    await trigger.trigger('click')
    await trigger.trigger('click')
    expect(wrapper.find('[data-testid="picker-popover"]').attributes('data-open')).toBe('false')
  })

  test('grid uses 6 columns by default', () => {
    const wrapper = makePopover()
    const grid = wrapper.find('[data-testid="picker-popover__grid"]')
    expect(grid.classes()).toContain('grid-cols-6')
  })

  test('grid uses 4 columns when size is "lg"', () => {
    const wrapper = makePopover({ size: 'lg' })
    const grid = wrapper.find('[data-testid="picker-popover__grid"]')
    expect(grid.classes()).toContain('grid-cols-4')
  })

  test('renders the extra slot below the grid', () => {
    const wrapper = makePopover(
      {},
      {
        default: '<span data-testid="default-slot" />',
        extra: '<span data-testid="extra-slot" />'
      }
    )
    expect(wrapper.find('[data-testid="extra-slot"]').exists()).toBe(true)
  })

  test('exposes a close scope prop that closes the popover', async () => {
    // Slot receives { close } — invoke via a button inside the slot
    const wrapper = shallowMount(PickerPopover, {
      props: { label: 'Test' },
      slots: {
        default: `<template #default="{ close }">
          <button data-testid="slot-close" @click="close" />
        </template>`
      },
      global: {
        stubs: { UiPopover: UiPopoverStub, UiButton: UiButtonStub },
        directives: { sfx: {} }
      }
    })
    // Open first
    await wrapper.find('[data-testid="picker-popover__trigger"]').trigger('click')
    expect(wrapper.find('[data-testid="picker-popover"]').attributes('data-open')).toBe('true')

    await wrapper.find('[data-testid="slot-close"]').trigger('click')
    expect(wrapper.find('[data-testid="picker-popover"]').attributes('data-open')).toBe('false')
  })
})

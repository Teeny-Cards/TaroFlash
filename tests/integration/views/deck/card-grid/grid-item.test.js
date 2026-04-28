import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))

vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

const CardStub = defineComponent({
  name: 'Card',
  inheritAttrs: false,
  props: ['side'],
  setup(props, { slots }) {
    const attrs = useAttrs()
    return () =>
      h(
        'div',
        {
          'data-testid': 'card-stub',
          'data-side': props.side,
          onClick: attrs.onClick
        },
        slots.default?.()
      )
  }
})

const UiRadioStub = defineComponent({
  name: 'UiRadio',
  props: ['checked'],
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h('button', {
        'data-testid': 'ui-radio-stub',
        'data-checked': String(props.checked),
        onClick: (e) => emit('click', e)
      })
  }
})

const GridItemMenuStub = defineComponent({
  name: 'GridItemMenu',
  setup() {
    return () => h('div', { 'data-testid': 'grid-item-menu-stub' })
  }
})

import GridItem from '@/views/deck/card-grid/grid-item.vue'

function mountGridItem(props = {}) {
  return mount(GridItem, {
    props: {
      card: { id: 1, front_text: 'q', back_text: 'a' },
      side: 'front',
      is_selecting: false,
      selected: false,
      ...props
    },
    attachTo: document.body,
    global: {
      stubs: {
        Card: CardStub,
        UiRadio: UiRadioStub,
        GridItemMenu: GridItemMenuStub
      }
    }
  })
}

describe('GridItem (card-grid/grid-item.vue)', () => {
  beforeEach(() => {
    mockEmitSfx.mockClear()
  })

  test('renders root with data-testid="grid-item"', () => {
    const wrapper = mountGridItem()
    expect(wrapper.find('[data-testid="grid-item"]').exists()).toBe(true)
  })

  test('initial side comes from the side prop', () => {
    const wrapper = mountGridItem({ side: 'back' })
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-side')).toBe('back')
  })

  test('clicking the card flips front → back and emits transition_up sfx', async () => {
    const wrapper = mountGridItem({ side: 'front' })
    await wrapper.find('[data-testid="card-stub"]').trigger('click')

    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-side')).toBe('back')
    expect(mockEmitSfx).toHaveBeenCalledWith('ui.transition_up')
  })

  test('clicking again flips back → front and emits transition_down sfx', async () => {
    const wrapper = mountGridItem({ side: 'front' })
    const card = wrapper.find('[data-testid="card-stub"]')

    await card.trigger('click')
    mockEmitSfx.mockClear()

    await card.trigger('click')
    expect(card.attributes('data-side')).toBe('front')
    expect(mockEmitSfx).toHaveBeenCalledWith('ui.transition_down')
  })

  test('does not flip or emit sfx when is_selecting is true', async () => {
    const wrapper = mountGridItem({ side: 'front', is_selecting: true })
    await wrapper.find('[data-testid="card-stub"]').trigger('click')

    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-side')).toBe('front')
    expect(mockEmitSfx).not.toHaveBeenCalled()
  })

  test('renders ui-radio inside the card while selecting', () => {
    const wrapper = mountGridItem({ is_selecting: true, selected: false })
    const radio = wrapper.find('[data-testid="ui-radio-stub"]')
    expect(radio.exists()).toBe(true)
    expect(radio.attributes('data-checked')).toBe('false')
  })

  test('forwards the selected prop to the radio', () => {
    const wrapper = mountGridItem({ is_selecting: true, selected: true })
    expect(wrapper.find('[data-testid="ui-radio-stub"]').attributes('data-checked')).toBe('true')
  })

  test('omits the radio when not selecting', () => {
    const wrapper = mountGridItem({ is_selecting: false })
    expect(wrapper.find('[data-testid="ui-radio-stub"]').exists()).toBe(false)
  })

  test('renders the grid-item-menu when not selecting', () => {
    const wrapper = mountGridItem({ is_selecting: false })
    expect(wrapper.find('[data-testid="grid-item-menu-stub"]').exists()).toBe(true)
  })

  test('hides the grid-item-menu while selecting', () => {
    const wrapper = mountGridItem({ is_selecting: true })
    expect(wrapper.find('[data-testid="grid-item-menu-stub"]').exists()).toBe(false)
  })

  test('clicking the radio emits card-selected and does not flip the card', async () => {
    const wrapper = mountGridItem({ side: 'front', is_selecting: true })
    await wrapper.find('[data-testid="ui-radio-stub"]').trigger('click')

    expect(wrapper.emitted('card-selected')).toEqual([[]])
    expect(wrapper.find('[data-testid="card-stub"]').attributes('data-side')).toBe('front')
    expect(mockEmitSfx).not.toHaveBeenCalled()
  })
})

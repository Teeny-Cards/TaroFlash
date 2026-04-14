import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { reactive, defineComponent, h } from 'vue'
import CardDefaultsToolbar from '@/components/modals/deck-settings/card-defaults-toolbar.vue'

// ── Stubs ──────────────────────────────────────────────────────────────────────

const PopoverStub = defineComponent({
  name: 'UiPopover',
  props: ['open'],
  setup(_props, { slots }) {
    return () => h('div', { 'data-testid': 'popover-stub' }, [slots.trigger?.(), slots.default?.()])
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeToolbar(defaults = {}) {
  const card_defaults = reactive(defaults)

  const wrapper = shallowMount(CardDefaultsToolbar, {
    props: { card_defaults },
    global: {
      stubs: { UiPopover: PopoverStub }
    }
  })

  return { wrapper, card_defaults }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('CardDefaultsToolbar', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the toolbar container', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.find('[data-testid="card-defaults-toolbar"]').exists()).toBe(true)
  })

  test('renders controls section', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.find('[data-testid="card-defaults-toolbar__controls"]').exists()).toBe(true)
  })

  test('renders the title label', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.find('[data-testid="card-defaults-toolbar"] p').text()).toBe('Card Defaults')
  })

  // ── Text size ──────────────────────────────────────────────────────────────

  test('displays the current text size label', () => {
    const { wrapper } = makeToolbar({ text_size: 'huge' })
    expect(wrapper.find('[data-testid="card-defaults-toolbar__text-size"]').text()).toContain(
      'Huge'
    )
  })

  test('defaults text size label to Large when unset', () => {
    const { wrapper } = makeToolbar()
    expect(wrapper.find('[data-testid="card-defaults-toolbar__text-size"]').text()).toContain(
      'Large'
    )
  })

  test('renders all 6 text size options', () => {
    const { wrapper } = makeToolbar()
    const options = wrapper.find('[data-testid="card-defaults-toolbar__text-size-options"]')
    expect(options.element.children.length).toBe(6)
  })

  test('clicking a text size option updates card_defaults', async () => {
    const { wrapper, card_defaults } = makeToolbar()
    const options = wrapper.find('[data-testid="card-defaults-toolbar__text-size-options"]')
    // First option is "Small"
    await options.element.children[0].dispatchEvent(new Event('click'))
    expect(card_defaults.text_size).toBe('small')
  })

  // ── Horizontal alignment ───────────────────────────────────────────────────

  test('renders 3 horizontal alignment buttons', () => {
    const { wrapper } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__h-align"]').findAll('button')
    expect(buttons.length).toBe(3)
  })

  test('clicking a horizontal alignment button updates card_defaults', async () => {
    const { wrapper, card_defaults } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__h-align"]').findAll('button')
    await buttons[0].trigger('click')
    expect(card_defaults.horizontal_alignment).toBe('left')
  })

  test('marks the active horizontal alignment button', () => {
    const { wrapper } = makeToolbar({ horizontal_alignment: 'right' })
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__h-align"]').findAll('button')
    // right is the 3rd option (index 2)
    expect(buttons[2].classes()).toContain('card-defaults-btn--active')
    expect(buttons[0].classes()).not.toContain('card-defaults-btn--active')
  })

  test('defaults horizontal alignment active state to center', () => {
    const { wrapper } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__h-align"]').findAll('button')
    // center is the 2nd option (index 1)
    expect(buttons[1].classes()).toContain('card-defaults-btn--active')
  })

  // ── Vertical alignment ─────────────────────────────────────────────────────

  test('renders 3 vertical alignment buttons', () => {
    const { wrapper } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__v-align"]').findAll('button')
    expect(buttons.length).toBe(3)
  })

  test('clicking a vertical alignment button updates card_defaults', async () => {
    const { wrapper, card_defaults } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__v-align"]').findAll('button')
    await buttons[2].trigger('click')
    expect(card_defaults.vertical_alignment).toBe('bottom')
  })

  test('marks the active vertical alignment button', () => {
    const { wrapper } = makeToolbar({ vertical_alignment: 'top' })
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__v-align"]').findAll('button')
    // top is the 1st option (index 0)
    expect(buttons[0].classes()).toContain('card-defaults-btn--active')
    expect(buttons[1].classes()).not.toContain('card-defaults-btn--active')
  })

  test('defaults vertical alignment active state to center', () => {
    const { wrapper } = makeToolbar()
    const buttons = wrapper.find('[data-testid="card-defaults-toolbar__v-align"]').findAll('button')
    // center is the 2nd option (index 1)
    expect(buttons[1].classes()).toContain('card-defaults-btn--active')
  })
})

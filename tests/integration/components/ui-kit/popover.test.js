import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import UiPopover from '@/components/ui-kit/popover.vue'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

// Mutable state objects shared between the mock factory and the tests.
// vi.hoisted runs before module imports so Vue's ref() is not available here —
// plain objects with a `.value` property work just as well for the mock.
const { floatingState } = vi.hoisted(() => {
  const floatingState = {
    placement: { value: 'top' },
    middlewareData: { value: {} },
    floatingStyles: { value: {} }
  }
  return { floatingState }
})

vi.mock('@floating-ui/vue', () => ({
  useFloating: vi.fn(() => ({
    placement: floatingState.placement,
    middlewareData: floatingState.middlewareData,
    floatingStyles: floatingState.floatingStyles
  })),
  shift: vi.fn(() => ({})),
  flip: vi.fn(() => ({})),
  autoUpdate: vi.fn(),
  arrow: vi.fn(() => ({})),
  offset: vi.fn(() => ({})),
  hide: vi.fn(() => ({}))
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function mountPopover(props = {}, slots = {}, mountOptions = {}) {
  return shallowMount(UiPopover, { props, slots, ...mountOptions })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UiPopover', () => {
  beforeEach(() => {
    floatingState.placement.value = 'top'
    floatingState.middlewareData.value = {}
  })

  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the container element', () => {
    const wrapper = mountPopover()
    expect(wrapper.find('[data-testid="ui-kit-popover-container"]').exists()).toBe(true)
  })

  // ── open prop — popover visibility ─────────────────────────────────────────

  test('popover is not visible when open=false and mode=click', () => {
    const wrapper = mountPopover({ open: false, mode: 'click' })
    expect(wrapper.find('[data-testid="ui-kit-popover"]').exists()).toBe(false)
  })

  test('popover is visible when open=true and mode=click', () => {
    const wrapper = mountPopover({ open: true, mode: 'click' })
    expect(wrapper.find('[data-testid="ui-kit-popover"]').exists()).toBe(true)
  })

  test('popover is always rendered when mode=hover', () => {
    const wrapper = mountPopover({ open: false, mode: 'hover' })
    expect(wrapper.find('[data-testid="ui-kit-popover"]').exists()).toBe(true)
  })

  // ── arrow rendering ────────────────────────────────────────────────────────

  test('renders arrow element by default (use_arrow=true)', () => {
    const wrapper = mountPopover({ open: true })
    expect(wrapper.find('[data-testid="ui-kit-popover__arrow"]').exists()).toBe(true)
  })

  test('does not render arrow when use_arrow=false', () => {
    const wrapper = mountPopover({ open: true, use_arrow: false })
    expect(wrapper.find('[data-testid="ui-kit-popover__arrow"]').exists()).toBe(false)
  })

  // ── arrow slot ─────────────────────────────────────────────────────────────

  test('custom arrow slot renders in place of the default arrow', () => {
    const wrapper = mountPopover(
      { open: true },
      { arrow: '<div data-testid="custom-arrow">▲</div>' }
    )
    expect(wrapper.find('[data-testid="custom-arrow"]').exists()).toBe(true)
  })

  // ── arrowStyle — staticSide placement ─────────────────────────────────────

  test('arrowStyle sets bottom offset for top placement', () => {
    floatingState.placement.value = 'top'
    const wrapper = mountPopover({ open: true })
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('bottom: -10px')
  })

  test('arrowStyle sets top offset for bottom placement', () => {
    floatingState.placement.value = 'bottom'
    const wrapper = mountPopover({ open: true })
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('top: -10px')
  })

  test('arrowStyle sets right offset for left placement', () => {
    floatingState.placement.value = 'left'
    const wrapper = mountPopover({ open: true })
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('right: -10px')
  })

  test('arrowStyle sets left offset for right placement', () => {
    floatingState.placement.value = 'right'
    const wrapper = mountPopover({ open: true })
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('left: -10px')
  })

  // ── arrowStyle — x/y from middlewareData ──────────────────────────────────

  test('arrowStyle positions arrow using x from middlewareData', async () => {
    floatingState.placement.value = 'top'
    floatingState.middlewareData.value = { arrow: { x: 30 } }
    const wrapper = mountPopover({ open: true })
    await wrapper.vm.$nextTick()
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('left: 30px')
  })

  test('arrowStyle positions arrow using y from middlewareData', async () => {
    floatingState.placement.value = 'right'
    floatingState.middlewareData.value = { arrow: { y: 15 } }
    const wrapper = mountPopover({ open: true })
    await wrapper.vm.$nextTick()
    const arrowEl = wrapper.find('[data-testid="ui-kit-popover__arrow"]')
    expect(arrowEl.attributes('style')).toContain('top: 15px')
  })

  // ── close event on outside click ───────────────────────────────────────────

  test('emits close when a click occurs outside the container (mode=click)', async () => {
    // The watcher only registers the click listener on the open false→true transition.
    const wrapper = mountPopover({ open: false, mode: 'click' }, {}, { attachTo: document.body })
    await wrapper.setProps({ open: true })

    // Create an element outside the component and click it — `document` itself
    // doesn't support `.closest()` which the handler requires.
    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    outside.remove()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

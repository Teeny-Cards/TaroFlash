import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import UiTooltip from '@/components/ui-kit/tooltip.vue'

vi.mock('@floating-ui/vue', () => ({
  useFloating: vi.fn(() => ({
    floatingStyles: { value: {} },
    update: vi.fn()
  })),
  flip: vi.fn(() => ({})),
  offset: vi.fn(() => ({})),
  autoUpdate: vi.fn(() => () => {})
}))

vi.mock('@/composables/use-media-query', () => ({
  useMediaQuery: vi.fn(() => ({ value: false }))
}))

function mountTooltip(props = {}, slots = {}) {
  return mount(UiTooltip, {
    props: { text: 'hello', ...props },
    slots: { default: '<span data-testid="trigger-label">trigger</span>', ...slots },
    attachTo: document.body
  })
}

async function dispatchPointer(wrapper, type, pointerType) {
  wrapper.element.dispatchEvent(
    new PointerEvent(type, { bubbles: true, pointerId: 1, pointerType })
  )
  await flushPromises()
}

function tooltipExists() {
  return document.body.querySelector('[data-testid="ui-tooltip"]') !== null
}

describe('UiTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('pointer activation', () => {
    test('pointerenter with mouse activates the tooltip', async () => {
      const wrapper = mountTooltip()

      await dispatchPointer(wrapper, 'pointerenter', 'mouse')

      expect(tooltipExists()).toBe(true)
      wrapper.unmount()
    })

    test('pointerenter with touch does NOT activate the tooltip', async () => {
      const wrapper = mountTooltip()

      await dispatchPointer(wrapper, 'pointerenter', 'touch')

      expect(tooltipExists()).toBe(false)
      wrapper.unmount()
    })

    test('pointerenter with pen does NOT activate the tooltip', async () => {
      const wrapper = mountTooltip()

      await dispatchPointer(wrapper, 'pointerenter', 'pen')

      expect(tooltipExists()).toBe(false)
      wrapper.unmount()
    })

    test('pointerleave with mouse deactivates the tooltip', async () => {
      const wrapper = mountTooltip()

      await dispatchPointer(wrapper, 'pointerenter', 'mouse')
      expect(tooltipExists()).toBe(true)

      await dispatchPointer(wrapper, 'pointerleave', 'mouse')
      expect(tooltipExists()).toBe(false)
      wrapper.unmount()
    })

    test('pointerleave with touch does not affect mouse-activated state', async () => {
      const wrapper = mountTooltip()

      await dispatchPointer(wrapper, 'pointerenter', 'mouse')
      expect(tooltipExists()).toBe(true)

      await dispatchPointer(wrapper, 'pointerleave', 'touch')
      expect(tooltipExists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('focus activation (still works)', () => {
    test('focusin shows the tooltip regardless of pointer events', async () => {
      const wrapper = mountTooltip()

      wrapper.element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
      await flushPromises()

      expect(tooltipExists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('suppress', () => {
    test('suppress=true keeps the tooltip hidden even when activated by mouse', async () => {
      const wrapper = mountTooltip({ suppress: true })

      await dispatchPointer(wrapper, 'pointerenter', 'mouse')

      expect(tooltipExists()).toBe(false)
      wrapper.unmount()
    })
  })
})

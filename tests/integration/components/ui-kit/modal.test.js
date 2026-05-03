import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, withAttrs } from 'vue'
import ModalUiKit from '@/components/ui-kit/modal.vue'
import { useModal, useModalRequestClose, request_close_handlers } from '@/composables/modal'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockDisableBodyScroll, mockEnableBodyScroll } = vi.hoisted(() => ({
  mockDisableBodyScroll: vi.fn(),
  mockEnableBodyScroll: vi.fn()
}))

const { mockRegister, mockDispose, mockClearScope } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
  mockDispose: vi.fn(),
  mockClearScope: vi.fn()
}))

vi.mock('body-scroll-lock', () => ({
  disableBodyScroll: mockDisableBodyScroll,
  enableBodyScroll: mockEnableBodyScroll
}))

vi.mock('@/composables/use-shortcuts', () => ({
  useShortcuts: vi.fn(() => ({
    register: mockRegister,
    dispose: mockDispose,
    clearScope: mockClearScope
  }))
}))

// gsap is imported transitively via modal-mode-config → animations/modal.
// The mock must call onComplete so transition-group JS hooks finish in browser mode.
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    fromTo: vi.fn((_el, _from, to) => to?.onComplete?.()),
    to: vi.fn((_el, opts) => opts?.onComplete?.())
  }
}))

const mobileBreakpointRef = ref(false)
const mockUseMobileBreakpoint = vi.fn(() => mobileBreakpointRef)

vi.mock('@/composables/use-media-query', () => ({
  useMediaQuery: vi.fn(() => ({ value: true })),
  useMobileBreakpoint: (...args) => mockUseMobileBreakpoint(...args)
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

// Module-level state persists across tests — reset both structures before each one.
beforeEach(() => {
  const { modal_stack, pop } = useModal()
  while (modal_stack.value.length > 0) pop()
  request_close_handlers.clear()
  mockUseMobileBreakpoint.mockClear()
  mobileBreakpointRef.value = false
})

const ModalStub = defineComponent({
  render() {
    return h('div', { 'data-testid': 'modal-stub' })
  }
})

function mountModal() {
  return mount(ModalUiKit, { attachTo: document.body })
}

function containerMode(wrapper) {
  return wrapper.find('[data-testid="ui-kit-modal-container"]').attributes('data-modal-mode')
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('modal.vue', () => {
  describe('container data-modal-mode reflects top modal mode', () => {
    test('defaults to dialog when stack is empty', async () => {
      const wrapper = mountModal()

      expect(containerMode(wrapper)).toBe('dialog')
    })

    test('is dialog for a dialog modal', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })

      const wrapper = mountModal()
      await nextTick()

      expect(containerMode(wrapper)).toBe('dialog')
    })

    test('is mobile-sheet for a mobile-sheet modal', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      expect(containerMode(wrapper)).toBe('mobile-sheet')
    })

    test('is popup for a popup modal', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      expect(containerMode(wrapper)).toBe('popup')
    })

    test('reflects the top (last) modal when multiple are stacked', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      expect(containerMode(wrapper)).toBe('mobile-sheet')
    })

    test('reverts to the underlying modal mode after the top modal is closed', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })
      const { close } = open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      close()
      await nextTick()

      expect(containerMode(wrapper)).toBe('dialog')
    })
  })

  describe('data-modal-mode on rendered components', () => {
    test('sets data-modal-mode on each rendered component', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      expect(wrapper.find('[data-testid="modal-stub"]').attributes('data-modal-mode')).toBe(
        'mobile-sheet'
      )
    })

    test('sets correct mode for dialog', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })

      const wrapper = mountModal()
      await nextTick()

      expect(wrapper.find('[data-testid="modal-stub"]').attributes('data-modal-mode')).toBe(
        'dialog'
      )
    })

    test('sets correct mode for popup', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      expect(wrapper.find('[data-testid="modal-stub"]').attributes('data-modal-mode')).toBe('popup')
    })
  })

  describe('simultaneous modals with different modes', () => {
    test('renders both modals when two are open', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      expect(wrapper.findAll('[data-testid="modal-stub"]')).toHaveLength(2)
    })

    test('each modal wrapper carries its own data-modal-mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      const stubs = wrapper.findAll('[data-testid="modal-stub"]')
      const modes = stubs.map((s) => s.attributes('data-modal-mode'))
      expect(modes).toContain('mobile-sheet')
      expect(modes).toContain('popup')
    })

    test('closing top modal leaves bottom modal with its own mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })
      const { close } = open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      close()
      await nextTick()

      expect(wrapper.findAll('[data-testid="modal-stub"]')).toHaveLength(1)
      expect(wrapper.find('[data-testid="modal-stub"]').attributes('data-modal-mode')).toBe(
        'mobile-sheet'
      )
    })
  })

  describe('backdrop', () => {
    test('does not render backdrop when no modals are open', async () => {
      const wrapper = mountModal()

      expect(wrapper.find('[data-testid="ui-kit-modal-backdrop"]').exists()).toBe(false)
    })

    test('renders backdrop when a modal with backdrop:true is open', async () => {
      const { open } = useModal()
      open(ModalStub, { backdrop: true })

      const wrapper = mountModal()
      await nextTick()

      expect(wrapper.find('[data-testid="ui-kit-modal-backdrop"]').exists()).toBe(true)
    })

    test('renders backdrop element even when backdrop:false', async () => {
      const { open } = useModal()
      open(ModalStub, { backdrop: false })

      const wrapper = mountModal()
      await nextTick()

      // Element renders but without the blur/tint modifier — presence is sufficient to assert
      expect(wrapper.find('[data-testid="ui-kit-modal-backdrop"]').exists()).toBe(true)
    })
  })

  describe('html overflow lock', () => {
    beforeEach(() => {
      document.documentElement.style.overflow = ''
    })

    test('locks html overflow to hidden while a modal is open', async () => {
      const { open } = useModal()
      open(ModalStub)

      mountModal()
      await nextTick()

      expect(document.documentElement.style.overflow).toBe('hidden')
    })

    test('restores html overflow when the last modal closes', async () => {
      const { open, pop } = useModal()
      open(ModalStub)

      mountModal()
      await nextTick()
      expect(document.documentElement.style.overflow).toBe('hidden')

      pop()
      await nextTick()

      expect(document.documentElement.style.overflow).toBe('')
    })

    test('restores html overflow on unmount', async () => {
      const { open } = useModal()
      open(ModalStub)

      const wrapper = mountModal()
      await nextTick()
      expect(document.documentElement.style.overflow).toBe('hidden')

      wrapper.unmount()

      expect(document.documentElement.style.overflow).toBe('')
    })
  })
})

// ── modal wrapper click.self dispatch ────────────────────────────────────────

describe('modal wrapper click.self', () => {
  beforeEach(() => {
    const { modal_stack, pop } = useModal()
    while (modal_stack.value.length > 0) pop()
    request_close_handlers.clear()
  })

  test('clicking the wrapper itself (not its content) closes the top modal', async () => {
    const { open, modal_stack } = useModal()
    open(ModalStub)

    const wrapper = mountModal()
    await nextTick()

    await wrapper.find('[data-testid="ui-kit-modal"]').trigger('click')

    expect(modal_stack.value).toHaveLength(0)
  })

  test('clicking the wrapper calls requestClose handler when one is registered', async () => {
    const requestClose = vi.fn()
    const HandlerComponent = defineComponent({
      setup() {
        useModalRequestClose(requestClose)
      },
      render: () => h('div', { 'data-testid': 'handler-component' })
    })
    const { open, modal_stack } = useModal()
    open(HandlerComponent)

    const wrapper = mountModal()
    await nextTick()

    await wrapper.find('[data-testid="ui-kit-modal"]').trigger('click')

    expect(requestClose).toHaveBeenCalledOnce()
    expect(modal_stack.value).toHaveLength(1)
  })
})

// ── backdrop click / ESC requestClose dispatch ────────────────────────────────

describe('requestClose dispatch', () => {
  // Clear shortcut mock call history before each test so we can find the ESC handler reliably
  beforeEach(() => {
    mockRegister.mockClear()
  })

  function makeHandlerComponent(requestClose) {
    return defineComponent({
      setup() {
        useModalRequestClose(requestClose)
      },
      render: () => h('div', { 'data-testid': 'handler-component' })
    })
  }

  describe('backdrop click', () => {
    test('calls the registered requestClose handler when one is registered', async () => {
      const requestClose = vi.fn()
      const { open, modal_stack } = useModal()
      open(makeHandlerComponent(requestClose))

      const wrapper = mountModal()
      await nextTick()

      await wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

      expect(requestClose).toHaveBeenCalledOnce()
      // Handler is responsible for closing — modal should still be open
      expect(modal_stack.value).toHaveLength(1)
    })

    test('pops the top modal when no requestClose handler is registered', async () => {
      const { open, modal_stack } = useModal()
      open(ModalStub)

      const wrapper = mountModal()
      await nextTick()

      await wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

      expect(modal_stack.value).toHaveLength(0)
    })

    test('calls the handler for the top modal only when multiple are stacked', async () => {
      const bottomHandler = vi.fn()
      const topHandler = vi.fn()
      const { open, modal_stack } = useModal()
      open(makeHandlerComponent(bottomHandler))
      open(makeHandlerComponent(topHandler))

      const wrapper = mountModal()
      await nextTick()

      await wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

      expect(topHandler).toHaveBeenCalledOnce()
      expect(bottomHandler).not.toHaveBeenCalled()
      expect(modal_stack.value).toHaveLength(2)
    })
  })

  describe('ESC key', () => {
    function invokeEscHandler() {
      const escCall = mockRegister.mock.calls.find((c) => c[0]?.combo === 'esc')
      escCall[0].handler()
    }

    test('calls the registered requestClose handler on ESC', async () => {
      const requestClose = vi.fn()
      const { open, modal_stack } = useModal()
      open(makeHandlerComponent(requestClose))

      mountModal()
      await nextTick()

      invokeEscHandler()

      expect(requestClose).toHaveBeenCalledOnce()
      expect(modal_stack.value).toHaveLength(1)
    })

    test('pops the top modal on ESC when no handler is registered', async () => {
      const { open, modal_stack } = useModal()
      open(ModalStub)

      mountModal()
      await nextTick()

      invokeEscHandler()

      expect(modal_stack.value).toHaveLength(0)
    })
  })
})

// ── mobile-breakpoint forwarding ─────────────────────────────────────────────

describe('mobile breakpoint forwarding', () => {
  beforeEach(() => {
    const { modal_stack, pop } = useModal()
    while (modal_stack.value.length > 0) pop()
    request_close_handlers.clear()
    mockUseMobileBreakpoint.mockClear()
  })

  test('sets data-mobile-below-width/height to "sm" when modal opens with no thresholds', async () => {
    const { open } = useModal()
    open(ModalStub)

    const wrapper = mountModal()
    await nextTick()

    const el = wrapper.find('[data-testid="ui-kit-modal"]')
    expect(el.attributes('data-mobile-below-width')).toBe('sm')
    expect(el.attributes('data-mobile-below-height')).toBe('sm')
  })

  test('sets data-mobile-below-width/height from open() args', async () => {
    const { open } = useModal()
    open(ModalStub, { mobile_below_width: 'md', mobile_below_height: 'lg' })

    const wrapper = mountModal()
    await nextTick()

    const el = wrapper.find('[data-testid="ui-kit-modal"]')
    expect(el.attributes('data-mobile-below-width')).toBe('md')
    expect(el.attributes('data-mobile-below-height')).toBe('lg')
  })

  test('each modal in the stack gets its own data-mobile-below attrs', async () => {
    const { open } = useModal()
    open(ModalStub, { mobile_below_width: 'sm', mobile_below_height: 'sm' })
    open(ModalStub, { mobile_below_width: 'lg', mobile_below_height: '2xl' })

    const wrapper = mountModal()
    await nextTick()

    const modals = wrapper.findAll('[data-testid="ui-kit-modal"]')
    const widths = modals.map((m) => m.attributes('data-mobile-below-width'))
    const heights = modals.map((m) => m.attributes('data-mobile-below-height'))
    expect(widths).toContain('sm')
    expect(widths).toContain('lg')
    expect(heights).toContain('sm')
    expect(heights).toContain('2xl')
  })
})

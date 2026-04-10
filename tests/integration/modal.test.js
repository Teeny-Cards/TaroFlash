import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import ModalUiKit from '@/components/ui-kit/modal.vue'
import { useModal } from '@/composables/modal'

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

// gsap is imported transitively via modal-mode-config → animations/modal
vi.mock('gsap', () => ({ gsap: { fromTo: vi.fn(), to: vi.fn() } }))

vi.mock('@/composables/use-media-query', () => ({
  useMediaQuery: vi.fn(() => ({ value: true }))
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

// Module-level modal_stack persists across tests — drain it before each one.
beforeEach(() => {
  const { modal_stack, pop } = useModal()
  while (modal_stack.value.length > 0) pop()
})

const ModalStub = defineComponent({
  template: '<div data-testid="modal-stub" />'
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

      expect(wrapper.find('[data-testid="modal-stub"]').attributes('data-modal-mode')).toBe(
        'popup'
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
})

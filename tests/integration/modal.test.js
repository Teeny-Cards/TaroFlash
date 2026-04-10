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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('modal.vue', () => {
  describe('container class based on top modal mode', () => {
    test('uses items-center when stack is empty (dialog default)', async () => {
      const wrapper = mountModal()

      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-center')
    })

    test('uses items-center for dialog mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })

      const wrapper = mountModal()
      await nextTick()

      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-center')
    })

    test('uses items-end for mobile-sheet mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-end')
    })

    test('uses items-center for popup mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-center')
    })

    test('reflects the top modal mode when multiple are stacked', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      // Top of stack is mobile-sheet → items-end
      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-end')
    })

    test('reverts to dialog class after mobile-sheet modal is closed', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })
      const { close } = open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      close()
      await nextTick()

      const container = wrapper.find('[data-testid="ui-kit-modal-container"]')
      expect(container.classes()).toContain('items-center')
      expect(container.classes()).not.toContain('items-end')
    })
  })

  describe('data-modal-mode attribute', () => {
    test('sets data-modal-mode on the rendered component', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'mobile-sheet' })

      const wrapper = mountModal()
      await nextTick()

      const stub = wrapper.find('[data-testid="modal-stub"]')
      expect(stub.attributes('data-modal-mode')).toBe('mobile-sheet')
    })

    test('sets data-modal-mode=dialog for dialog mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'dialog' })

      const wrapper = mountModal()
      await nextTick()

      const stub = wrapper.find('[data-testid="modal-stub"]')
      expect(stub.attributes('data-modal-mode')).toBe('dialog')
    })

    test('sets data-modal-mode=popup for popup mode', async () => {
      const { open } = useModal()
      open(ModalStub, { mode: 'popup' })

      const wrapper = mountModal()
      await nextTick()

      const stub = wrapper.find('[data-testid="modal-stub"]')
      expect(stub.attributes('data-modal-mode')).toBe('popup')
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

    test('renders backdrop without blur class when backdrop:false', async () => {
      const { open } = useModal()
      open(ModalStub, { backdrop: false })

      const wrapper = mountModal()
      await nextTick()

      const backdrop = wrapper.find('[data-testid="ui-kit-modal-backdrop"]')
      expect(backdrop.exists()).toBe(true)
      expect(backdrop.classes()).not.toContain('pointer-fine:bg-black/10')
    })
  })
})

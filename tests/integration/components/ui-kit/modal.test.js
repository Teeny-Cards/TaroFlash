import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vite-plus/test'
import Modal from '@/components/ui-kit/modal.vue'
import { shallowRef, defineComponent, markRaw } from 'vue'
import { ModalEntryBuilder } from '@tests/mocks/types/modal-entry'

vi.hoisted(() => {
  vi.resetModules()

  // jsdom does not implement matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  })
})

const TestModal = markRaw(
  defineComponent({
    template: '<div>Test Modal</div>'
  })
)

const mock_modal_stack = shallowRef([])
const mock_pop = vi.fn()

vi.mock('@/composables/modal', () => {
  return {
    useModal: vi.fn(() => ({
      modal_stack: mock_modal_stack,
      pop: mock_pop
    }))
  }
})

beforeEach(() => {
  mock_modal_stack.value = []
  mock_pop.mockReset()
})

test('renders nothing when modal stack is empty', () => {
  const wrapper = mount(Modal)
  expect(wrapper.find('[data-testid="ui-kit-modal-container"]').element.innerHTML.trim()).toBe('')
})

test('renders modal component from modal stack', () => {
  const entry = ModalEntryBuilder(TestModal).one()
  mock_modal_stack.value.push(entry)

  const wrapper = mount(Modal)

  expect(wrapper.find('[data-testid="ui-kit-modal-container"]').element.children.length).toBe(1)
})

test('renders multiple modals from modal stack', () => {
  const entry1 = ModalEntryBuilder(TestModal).one()
  const entry2 = ModalEntryBuilder(TestModal).one()
  mock_modal_stack.value.push(entry1, entry2)

  const wrapper = mount(Modal)

  expect(wrapper.find('[data-testid="ui-kit-modal-container"]').element.children.length).toBe(2)
})

test('applies backdrop class only when at least one modal requests it', () => {
  const entry1 = ModalEntryBuilder(TestModal).one({ overrides: { backdrop: false } })
  const entry2 = ModalEntryBuilder(TestModal).one({ overrides: { backdrop: true } })
  mock_modal_stack.value.push(entry1, entry2)

  const wrapper = mount(Modal)

  expect(wrapper.find('[data-testid="ui-kit-modal-backdrop"]').classes()).toContain(
    'pointer-fine:backdrop-blur-4'
  )
})

test('calls pop on backdrop click', async () => {
  const entry = ModalEntryBuilder(TestModal).one()
  mock_modal_stack.value.push(entry)

  const wrapper = mount(Modal)

  await wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

  expect(mock_pop).toHaveBeenCalled()
})

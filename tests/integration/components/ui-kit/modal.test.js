import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import Modal from '@/components/ui-kit/modal.vue'
import { shallowRef, defineComponent, markRaw } from 'vue'
import { ModalEntryBuilder } from '@tests/mocks/types/modal-entry'
import { beforeEach } from 'vitest'

// Since ui-kit components are imported in a setup file
// Vitest will not mock modules imported inside them.
// Need to clear all module caches before running the test file.
vi.hoisted(() => {
  vi.resetModules()
})

const TestModal = markRaw(
  defineComponent({
    template: '<div>Test Modal</div>'
  })
)

const mock_modal_stack = shallowRef([])

vi.mock('@/composables/modal', () => {
  return {
    useModal: vi.fn(() => ({
      modal_stack: mock_modal_stack
    }))
  }
})

beforeEach(() => {
  mock_modal_stack.value = []
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
    'backdrop-blur-4'
  )
})

test('resolves and removes top modal on backdrop click if enabled', async () => {
  const entry = ModalEntryBuilder(TestModal).one()
  mock_modal_stack.value.push(entry)

  const wrapper = mount(Modal)

  await wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

  expect(entry.close).toHaveBeenCalled()
})

test('does not close modal on backdrop click if `global_close` is false', () => {
  const entry = ModalEntryBuilder(TestModal).one({ overrides: { global_close: false } })
  mock_modal_stack.value.push(entry)

  const wrapper = mount(Modal)

  wrapper.find('[data-testid="ui-kit-modal-backdrop"]').trigger('click')

  expect(entry.resolve).not.toHaveBeenCalled()
  expect(mock_modal_stack.value.length).toBe(1)
})

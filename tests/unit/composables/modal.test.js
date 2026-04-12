import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { defineComponent } from 'vue'
import { useModal } from '@/composables/modal'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Module-level modal_stack persists across tests — drain it before each one.
beforeEach(() => {
  const { modal_stack, pop } = useModal()
  while (modal_stack.value.length > 0) pop()
})

const FakeComponent = defineComponent({ template: '<div />' })

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useModal', () => {
  describe('open', () => {
    test('pushes an entry onto modal_stack', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent)

      expect(modal_stack.value).toHaveLength(1)
    })

    test('defaults mode to dialog', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent)

      expect(modal_stack.value[0].mode).toBe('dialog')
    })

    test('stores the given mode on the entry', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent, { mode: 'mobile-sheet' })

      expect(modal_stack.value[0].mode).toBe('mobile-sheet')
    })

    test('stores popup mode', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent, { mode: 'popup' })

      expect(modal_stack.value[0].mode).toBe('popup')
    })

    test('defaults backdrop to false', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent)

      expect(modal_stack.value[0].backdrop).toBe(false)
    })

    test('stores the given backdrop option', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent, { backdrop: true })

      expect(modal_stack.value[0].backdrop).toBe(true)
    })

    test('injects a close function into componentProps', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent)

      expect(typeof modal_stack.value[0].componentProps.close).toBe('function')
    })

    test('merges extra props into componentProps', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent, { props: { deck: { id: 42 } } })

      expect(modal_stack.value[0].componentProps.deck).toEqual({ id: 42 })
    })

    test('returns a Promise as response', () => {
      const { open } = useModal()

      const { response } = open(FakeComponent)

      expect(response).toBeInstanceOf(Promise)
    })

    test('returns a close function', () => {
      const { open } = useModal()

      const { close } = open(FakeComponent)

      expect(typeof close).toBe('function')
    })

    test('stacks multiple entries in order', () => {
      const { open, modal_stack } = useModal()

      open(FakeComponent, { mode: 'dialog' })
      open(FakeComponent, { mode: 'popup' })

      expect(modal_stack.value).toHaveLength(2)
      expect(modal_stack.value[0].mode).toBe('dialog')
      expect(modal_stack.value[1].mode).toBe('popup')
    })
  })

  describe('close (via returned close fn)', () => {
    test('removes the entry from modal_stack', () => {
      const { open, modal_stack } = useModal()
      const { close } = open(FakeComponent)

      close()

      expect(modal_stack.value).toHaveLength(0)
    })

    test('only removes the matching entry when multiple are open', () => {
      const { open, modal_stack } = useModal()
      open(FakeComponent, { mode: 'dialog' })
      const { close } = open(FakeComponent, { mode: 'popup' })

      close()

      expect(modal_stack.value).toHaveLength(1)
      expect(modal_stack.value[0].mode).toBe('dialog')
    })

    test('resolves the response promise with the given value', async () => {
      const { open } = useModal()
      const { close, response } = open(FakeComponent)

      close('my-result')

      await expect(response).resolves.toBe('my-result')
    })

    test('resolves the response promise with undefined when called with no value', async () => {
      const { open } = useModal()
      const { close, response } = open(FakeComponent)

      close()

      await expect(response).resolves.toBeUndefined()
    })
  })

  describe('pop', () => {
    test('removes the top (last) entry', () => {
      const { open, pop, modal_stack } = useModal()
      open(FakeComponent, { mode: 'dialog' })
      open(FakeComponent, { mode: 'popup' })

      pop()

      expect(modal_stack.value).toHaveLength(1)
      expect(modal_stack.value[0].mode).toBe('dialog')
    })

    test('is a no-op when the stack is empty', () => {
      const { pop, modal_stack } = useModal()

      expect(() => pop()).not.toThrow()
      expect(modal_stack.value).toHaveLength(0)
    })
  })
})

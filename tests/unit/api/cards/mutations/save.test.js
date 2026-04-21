import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, saveCardMock, debounceMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  saveCardMock: vi.fn().mockResolvedValue(undefined),
  // Call the debounced fn immediately so the mutation resolves synchronously
  // in tests. We still assert on the debounce call shape.
  debounceMock: vi.fn((fn) => fn())
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy
}))

vi.mock('@/api/cards/db', () => ({
  saveCard: saveCardMock
}))

vi.mock('@/utils/debounce', () => ({
  debounce: debounceMock
}))

import { useSaveCardMutation } from '@/api/cards/mutations/save'

beforeEach(() => {
  useMutationSpy.mockClear()
  saveCardMock.mockClear()
  saveCardMock.mockResolvedValue(undefined)
  debounceMock.mockClear()
  debounceMock.mockImplementation((fn) => fn())
})

function configFrom() {
  useSaveCardMutation()
  return useMutationSpy.mock.calls[0][0]
}

describe('useSaveCardMutation', () => {
  test('wraps saveCard in debounce keyed by card id so concurrent edits to different cards do not supersede', async () => {
    const { mutation } = configFrom()

    await mutation({ card: { id: 5, deck_id: 10 }, values: { front_text: 'x' } })

    expect(debounceMock).toHaveBeenCalledWith(expect.any(Function), { key: 'card-5' })
  })

  test('the debounced function, when invoked, calls saveCard with the card and values', async () => {
    const { mutation } = configFrom()

    const card = { id: 5, deck_id: 10 }
    const values = { front_text: 'updated' }
    await mutation({ card, values })

    expect(saveCardMock).toHaveBeenCalledWith(card, values)
  })

  test('does not install an onSettled handler — deck cache is not invalidated on self-save', () => {
    // Refetch after a self-save would clobber the component-owned editor
    // state that's driving the input. Bulk ops invalidate explicitly.
    const config = configFrom()
    expect(config.onSettled).toBeUndefined()
  })
})

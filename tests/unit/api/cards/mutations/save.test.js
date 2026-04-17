import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, saveCardMock, debounceMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  saveCardMock: vi.fn().mockResolvedValue(undefined),
  // Call the debounced fn immediately so the mutation resolves synchronously
  // in tests. We still assert on the debounce call shape.
  debounceMock: vi.fn((fn) => fn())
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
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
  invalidateSpy.mockClear()
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

  test("onSettled invalidates the card's deck (list + detail)", () => {
    const { onSettled } = configFrom()

    onSettled(undefined, undefined, { card: { id: 5, deck_id: 10 }, values: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
  })

  test('onSettled no-ops invalidation when the card has no deck_id', () => {
    const { onSettled } = configFrom()

    onSettled(undefined, undefined, { card: { id: 5 }, values: {} })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})

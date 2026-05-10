import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, resetDeckReviewsMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  resetDeckReviewsMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/reviews/db', () => ({
  resetDeckReviews: resetDeckReviewsMock
}))

import { useResetDeckReviewsMutation } from '@/api/reviews/mutations/reset-deck-reviews'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  resetDeckReviewsMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls[0][0]
}

describe('useResetDeckReviewsMutation', () => {
  test('mutation delegates to resetDeckReviews with deck_id', async () => {
    const { mutation } = configFrom(useResetDeckReviewsMutation)
    await mutation(7)
    expect(resetDeckReviewsMock).toHaveBeenCalledWith(7)
  })

  test('onSettled invalidates decks list, the deck, and the deck cards', () => {
    const { onSettled } = configFrom(useResetDeckReviewsMutation)

    onSettled(undefined, undefined, 7)

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 7] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 7] })
  })

  test('onSettled is a no-op on error', () => {
    const { onSettled } = configFrom(useResetDeckReviewsMutation)

    onSettled(undefined, new Error('boom'), 7)

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})

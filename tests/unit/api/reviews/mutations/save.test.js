import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, saveReviewMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  saveReviewMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/reviews/db', () => ({
  saveReview: saveReviewMock
}))

import { useSaveReviewMutation, useFlushDeckReviews } from '@/api/reviews/mutations/save'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  saveReviewMock.mockClear()
  saveReviewMock.mockResolvedValue(undefined)
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls[0][0]
}

describe('useSaveReviewMutation', () => {
  test('mutation delegates to saveReview with card_id, card, log (deck_id is not persisted)', async () => {
    const { mutation } = configFrom(useSaveReviewMutation)

    const vars = {
      card_id: 42,
      deck_id: 7,
      card: { due: 'x', stability: 1 },
      log: { rating: 3 }
    }
    await mutation(vars)

    expect(saveReviewMock).toHaveBeenCalledWith(42, vars.card, vars.log)
    expect(saveReviewMock).toHaveBeenCalledTimes(1)
  })

  test('onSettled invalidates ["decks"] so dashboard due_count refreshes', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, undefined, { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })

  // Per-review saves must not invalidate ["deck", id] or ["cards", id]: those
  // are active during a study session and refetching on every rating churns
  // the full deck+cards join. The session flushes them once on close instead.
  test('onSettled fires exactly one invalidation per review (no deck/cards refetch mid-session)', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, undefined, { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledTimes(1)
  })

  test('invalidation still fires when the mutation itself errored', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, new Error('network'), { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledTimes(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })
})

describe('useFlushDeckReviews', () => {
  test('invalidates ["deck", deck_id] and ["cards", deck_id]', () => {
    const flush = useFlushDeckReviews()

    flush(7)

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 7] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 7] })
    expect(invalidateSpy).toHaveBeenCalledTimes(2)
  })

  test('does not invalidate ["decks"] — that is handled by the per-review mutation', () => {
    const flush = useFlushDeckReviews()

    flush(7)

    expect(invalidateSpy).not.toHaveBeenCalledWith({ key: ['decks'] })
  })
})

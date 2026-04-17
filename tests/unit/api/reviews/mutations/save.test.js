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

import { useSaveReviewMutation } from '@/api/reviews/mutations/save'

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

  test('onSettled invalidates ["deck", deck_id] so the detail view refetches', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, undefined, { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 7] })
  })

  test('onSettled invalidates ["cards", deck_id] so the cards-in-deck query refetches', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, undefined, { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 7] })
  })

  test('onSettled fires exactly three invalidations (no accidental over-invalidation)', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, undefined, { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledTimes(3)
  })

  test('invalidations still fire when the mutation itself errored', () => {
    const { onSettled } = configFrom(useSaveReviewMutation)

    onSettled(undefined, new Error('network'), { card_id: 1, deck_id: 7, card: {}, log: {} })

    expect(invalidateSpy).toHaveBeenCalledTimes(3)
  })
})

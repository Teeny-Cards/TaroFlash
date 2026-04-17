import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, upsertCardsMock, deleteCardsMock, moveCardsToDeckMock } =
  vi.hoisted(() => ({
    useMutationSpy: vi.fn((cfg) => cfg),
    invalidateSpy: vi.fn(),
    upsertCardsMock: vi.fn().mockResolvedValue([]),
    deleteCardsMock: vi.fn().mockResolvedValue(undefined),
    moveCardsToDeckMock: vi.fn().mockResolvedValue(undefined)
  }))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/cards/db', () => ({
  upsertCards: upsertCardsMock,
  deleteCards: deleteCardsMock,
  moveCardsToDeck: moveCardsToDeckMock
}))

import { useUpsertCardsMutation } from '@/api/cards/mutations/upsert-bulk'
import { useDeleteCardsMutation } from '@/api/cards/mutations/delete'
import { useMoveCardsToDeckMutation } from '@/api/cards/mutations/move-to-deck'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  upsertCardsMock.mockClear()
  deleteCardsMock.mockClear()
  moveCardsToDeckMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls.at(-1)[0]
}

function invalidatedKeys() {
  return invalidateSpy.mock.calls.map((c) => c[0].key)
}

describe('useUpsertCardsMutation', () => {
  test('aggregates unique deck_ids from the batch and invalidates each', () => {
    const { onSettled } = configFrom(useUpsertCardsMutation)

    onSettled([], undefined, [
      { id: 1, deck_id: 10 },
      { id: 2, deck_id: 10 },
      { id: 3, deck_id: 20 }
    ])

    const keys = invalidatedKeys()
    expect(keys).toContainEqual(['deck', 10])
    expect(keys).toContainEqual(['deck', 20])
    expect(keys).toContainEqual(['cards', 10])
    expect(keys).toContainEqual(['cards', 20])
  })

  test('skips cards without a deck_id when aggregating', () => {
    const { onSettled } = configFrom(useUpsertCardsMutation)

    onSettled([], undefined, [{ id: 1 }, { id: 2, deck_id: 10 }])

    const keys = invalidatedKeys()
    // no `['deck', undefined]` key was invalidated
    expect(keys.every((k) => !(k[0] === 'deck' && k[1] === undefined))).toBe(true)
    expect(keys).toContainEqual(['deck', 10])
  })

  test('also invalidates all card counts + decks list (bulk writes shift totals)', () => {
    const { onSettled } = configFrom(useUpsertCardsMutation)

    onSettled([], undefined, [{ id: 1, deck_id: 10 }])

    const keys = invalidatedKeys()
    expect(keys).toContainEqual(['cards', 'count'])
    expect(keys).toContainEqual(['decks'])
  })
})

describe('useDeleteCardsMutation', () => {
  test('aggregates unique deck_ids and invalidates each plus counts', () => {
    const { onSettled } = configFrom(useDeleteCardsMutation)

    onSettled(undefined, undefined, [
      { id: 1, deck_id: 10 },
      { id: 2, deck_id: 20 }
    ])

    const keys = invalidatedKeys()
    expect(keys).toContainEqual(['deck', 10])
    expect(keys).toContainEqual(['deck', 20])
    expect(keys).toContainEqual(['cards', 'count'])
    expect(keys).toContainEqual(['decks'])
  })

  test('mutation delegates to deleteCards', async () => {
    const { mutation } = configFrom(useDeleteCardsMutation)
    const cards = [{ id: 1, deck_id: 10 }]
    await mutation(cards)
    expect(deleteCardsMock).toHaveBeenCalledWith(cards)
  })
})

describe('useMoveCardsToDeckMutation', () => {
  test('invalidates both source deck(s) AND destination deck', () => {
    const { onSettled } = configFrom(useMoveCardsToDeckMutation)

    // Cards originally in deck 10 being moved to deck 20.
    onSettled(undefined, undefined, {
      cards: [
        { id: 1, deck_id: 10 },
        { id: 2, deck_id: 10 }
      ],
      deck_id: 20
    })

    const keys = invalidatedKeys()
    expect(keys).toContainEqual(['deck', 10]) // source
    expect(keys).toContainEqual(['deck', 20]) // destination
    expect(keys).toContainEqual(['cards', 10])
    expect(keys).toContainEqual(['cards', 20])
  })

  test('invalidates multiple source decks when the batch spans decks', () => {
    const { onSettled } = configFrom(useMoveCardsToDeckMutation)

    onSettled(undefined, undefined, {
      cards: [
        { id: 1, deck_id: 10 },
        { id: 2, deck_id: 30 }
      ],
      deck_id: 20
    })

    const keys = invalidatedKeys()
    expect(keys).toContainEqual(['deck', 10])
    expect(keys).toContainEqual(['deck', 30])
    expect(keys).toContainEqual(['deck', 20])
  })

  test('mutation delegates to moveCardsToDeck with the cards and destination deck_id', async () => {
    const { mutation } = configFrom(useMoveCardsToDeckMutation)
    const cards = [{ id: 1, deck_id: 10 }]
    await mutation({ cards, deck_id: 20 })
    expect(moveCardsToDeckMock).toHaveBeenCalledWith(cards, 20)
  })
})

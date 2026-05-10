import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, upsertDeckMock, deleteDeckMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  upsertDeckMock: vi.fn().mockResolvedValue(undefined),
  deleteDeckMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/decks/db', () => ({
  upsertDeck: upsertDeckMock,
  deleteDeck: deleteDeckMock
}))

import { useUpsertDeckMutation } from '@/api/decks/mutations/upsert'
import { useDeleteDeckMutation } from '@/api/decks/mutations/delete'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  upsertDeckMock.mockClear()
  deleteDeckMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useUpsertDeckMutation', () => {
  test('mutation delegates to upsertDeck', async () => {
    const { mutation } = configFrom(useUpsertDeckMutation)
    await mutation({ id: 1, title: 'new' })
    expect(upsertDeckMock).toHaveBeenCalledWith({ id: 1, title: 'new' })
  })

  test('onSettled invalidates ["decks"] so the dashboard list refreshes', () => {
    const { onSettled } = configFrom(useUpsertDeckMutation)
    onSettled(undefined, undefined, { id: 42, title: 'x' })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })

  test('onSettled invalidates ["deck", id] so the detail view refreshes when it exists', () => {
    const { onSettled } = configFrom(useUpsertDeckMutation)
    onSettled(undefined, undefined, { id: 42, title: 'x' })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 42] })
  })

  test('onSettled skips ["deck", id] invalidation when the deck has no id (insert path)', () => {
    const { onSettled } = configFrom(useUpsertDeckMutation)
    onSettled(undefined, undefined, { title: 'brand new' })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
    const detailCalls = invalidateSpy.mock.calls.filter((c) => c[0].key[0] === 'deck')
    expect(detailCalls).toHaveLength(0)
  })
})

describe('useDeleteDeckMutation', () => {
  test('mutation delegates to deleteDeck with the id', async () => {
    const { mutation } = configFrom(useDeleteDeckMutation)
    await mutation(42)
    expect(deleteDeckMock).toHaveBeenCalledWith(42)
  })

  test('onSettled invalidates ["decks"] so the dashboard list refreshes', () => {
    const { onSettled } = configFrom(useDeleteDeckMutation)
    onSettled(undefined, undefined, 42)
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })

  test('on success, invalidates ["deck", id] with refetchActive=false so no 404 refetch', () => {
    const { onSettled } = configFrom(useDeleteDeckMutation)
    onSettled(undefined, undefined, 42)
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 42] }, false)
  })

  test('on error, skips ["deck", id] invalidation (row still exists, keep cache)', () => {
    const { onSettled } = configFrom(useDeleteDeckMutation)
    onSettled(undefined, new Error('boom'), 42)
    const detailCalls = invalidateSpy.mock.calls.filter((c) => c[0].key[0] === 'deck')
    expect(detailCalls).toHaveLength(0)
    // List invalidation still fires regardless — harmless on error
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })
})

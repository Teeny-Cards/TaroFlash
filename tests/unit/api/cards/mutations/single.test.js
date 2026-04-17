import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, upsertCardMock, insertCardMock, reorderCardMock } =
  vi.hoisted(() => ({
    useMutationSpy: vi.fn((cfg) => cfg),
    invalidateSpy: vi.fn(),
    upsertCardMock: vi.fn().mockResolvedValue({}),
    insertCardMock: vi.fn().mockResolvedValue({ id: 9, rank: 1000 }),
    reorderCardMock: vi.fn().mockResolvedValue(undefined)
  }))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/cards/db', () => ({
  upsertCard: upsertCardMock,
  insertCard: insertCardMock,
  reorderCard: reorderCardMock
}))

import { useUpsertCardMutation } from '@/api/cards/mutations/upsert'
import { useInsertCardMutation } from '@/api/cards/mutations/insert'
import { useReorderCardMutation } from '@/api/cards/mutations/reorder'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  upsertCardMock.mockClear()
  insertCardMock.mockClear()
  reorderCardMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useUpsertCardMutation', () => {
  test('mutation delegates to upsertCard', async () => {
    const { mutation } = configFrom(useUpsertCardMutation)
    await mutation({ id: 1, deck_id: 10, front_text: 'x' })
    expect(upsertCardMock).toHaveBeenCalledWith({ id: 1, deck_id: 10, front_text: 'x' })
  })

  test("onSettled invalidates the card's deck", () => {
    const { onSettled } = configFrom(useUpsertCardMutation)
    onSettled(undefined, undefined, { id: 1, deck_id: 10 })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
  })
})

describe('useInsertCardMutation', () => {
  test('mutation delegates to insertCard', async () => {
    const { mutation } = configFrom(useInsertCardMutation)
    const params = {
      deck_id: 10,
      left_card_id: null,
      right_card_id: null,
      front_text: 'Q',
      back_text: 'A'
    }
    await mutation(params)
    expect(insertCardMock).toHaveBeenCalledWith(params)
  })

  test('onSettled invalidates the deck + all card counts (card creation shifts deck totals)', () => {
    const { onSettled } = configFrom(useInsertCardMutation)
    onSettled({ id: 9, rank: 1000 }, undefined, {
      deck_id: 10,
      left_card_id: null,
      right_card_id: null,
      front_text: '',
      back_text: ''
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 'count'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['decks'] })
  })
})

describe('useReorderCardMutation', () => {
  test('mutation delegates to reorderCard with card_id and neighbors', async () => {
    const { mutation } = configFrom(useReorderCardMutation)
    await mutation({ card_id: 42, deck_id: 10, left_card_id: 1, right_card_id: 2 })
    expect(reorderCardMock).toHaveBeenCalledWith(42, 1, 2)
  })

  test('onSettled invalidates only the affected deck (reorder does not change counts)', () => {
    const { onSettled } = configFrom(useReorderCardMutation)
    onSettled(undefined, undefined, { card_id: 42, deck_id: 10 })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
    expect(invalidateSpy).not.toHaveBeenCalledWith({ key: ['decks'] })
    expect(invalidateSpy).not.toHaveBeenCalledWith({ key: ['cards', 'count'] })
  })
})

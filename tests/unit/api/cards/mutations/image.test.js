import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, setCardImageMock, deleteCardImageMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  setCardImageMock: vi.fn().mockResolvedValue(undefined),
  deleteCardImageMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/cards/db', () => ({
  setCardImage: setCardImageMock,
  deleteCardImage: deleteCardImageMock
}))

import { useSetCardImageMutation } from '@/api/cards/mutations/set-image'
import { useDeleteCardImageMutation } from '@/api/cards/mutations/delete-image'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  setCardImageMock.mockClear()
  deleteCardImageMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useSetCardImageMutation', () => {
  test('mutation delegates to setCardImage with card_id, file, side (deck_id is not persisted)', async () => {
    const { mutation } = configFrom(useSetCardImageMutation)
    const file = new File(['x'], 'a.png', { type: 'image/png' })

    await mutation({ card_id: 42, deck_id: 10, file, side: 'front' })

    expect(setCardImageMock).toHaveBeenCalledWith(42, file, 'front')
  })

  test('onSettled invalidates the deck the card belongs to', () => {
    const { onSettled } = configFrom(useSetCardImageMutation)

    onSettled(undefined, undefined, {
      card_id: 42,
      deck_id: 10,
      file: new File(['x'], 'a.png', { type: 'image/png' }),
      side: 'front'
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
  })
})

describe('useDeleteCardImageMutation', () => {
  test('mutation delegates to deleteCardImage with card_id + side (deck_id is not persisted)', async () => {
    const { mutation } = configFrom(useDeleteCardImageMutation)

    await mutation({ card_id: 42, deck_id: 10, side: 'back' })

    expect(deleteCardImageMock).toHaveBeenCalledWith(42, 'back')
  })

  test('onSettled invalidates the deck the card belongs to', () => {
    const { onSettled } = configFrom(useDeleteCardImageMutation)

    onSettled(undefined, undefined, { card_id: 42, deck_id: 10, side: 'front' })

    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['deck', 10] })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['cards', 10] })
  })
})

import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { useDeckActions } from '@/composables/deck/use-deck-actions'

const { refreshMock, upsertMock, countRef, mockCreateDeckCapability, mockWarn } = vi.hoisted(
  () => ({
    refreshMock: vi.fn().mockResolvedValue(undefined),
    upsertMock: vi.fn().mockResolvedValue(undefined),
    countRef: { value: 0 },
    mockCreateDeckCapability: vi.fn(),
    mockWarn: vi.fn()
  })
)

vi.mock('@/api/decks', () => ({
  useMemberDeckCountQuery: () => ({
    refresh: refreshMock,
    data: countRef
  }),
  useUpsertDeckMutation: () => ({
    mutate: upsertMock,
    mutateAsync: upsertMock
  })
}))

vi.mock('@/composables/use-can', () => ({
  useCan: () => ({ createDeck: mockCreateDeckCapability })
}))

vi.mock('@/composables/alert', () => ({
  useAlert: () => ({
    warn: mockWarn
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

function makeAlertResponse(promise = Promise.resolve(undefined)) {
  return { response: promise }
}

describe('useDeckActions', () => {
  beforeEach(() => {
    refreshMock.mockReset()
    refreshMock.mockResolvedValue(undefined)
    upsertMock.mockReset()
    upsertMock.mockResolvedValue(undefined)
    countRef.value = 0
    mockCreateDeckCapability.mockReset()
    mockWarn.mockReset()
    mockWarn.mockReturnValue(makeAlertResponse())
  })

  describe('createDeck', () => {
    test('calls upsertDeck and returns true when capability check passes', async () => {
      countRef.value = 2
      mockCreateDeckCapability.mockReturnValue(true)

      const { createDeck } = useDeckActions()
      const result = await createDeck({ title: 'New Deck' })

      expect(mockCreateDeckCapability).toHaveBeenCalledWith(2)
      expect(upsertMock).toHaveBeenCalledWith({ title: 'New Deck' })
      expect(mockWarn).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('opens warn alert and returns false when capability check fails', async () => {
      countRef.value = 5
      mockCreateDeckCapability.mockReturnValue(false)

      const { createDeck } = useDeckActions()
      const result = await createDeck({ title: 'Blocked Deck' })

      expect(mockWarn).toHaveBeenCalledWith({
        title: 'errors.deck-limit-reached.title',
        message: 'errors.deck-limit-reached.message'
      })
      expect(upsertMock).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    test('awaits the alert response before resolving', async () => {
      countRef.value = 5
      mockCreateDeckCapability.mockReturnValue(false)

      let resolveAlert
      mockWarn.mockReturnValue(
        makeAlertResponse(
          new Promise((r) => {
            resolveAlert = r
          })
        )
      )

      const { createDeck } = useDeckActions()
      const pending = createDeck({ title: 'Blocked' })

      let settled = false
      pending.then(() => {
        settled = true
      })

      await Promise.resolve()
      await Promise.resolve()
      expect(settled).toBe(false)

      resolveAlert()
      await pending
      expect(settled).toBe(true)
    })
  })

  describe('updateDeck', () => {
    test('calls upsertDeck and returns true', async () => {
      const { updateDeck } = useDeckActions()
      const result = await updateDeck({ id: 1, title: 'Updated' })

      expect(upsertMock).toHaveBeenCalledWith({ id: 1, title: 'Updated' })
      expect(result).toBe(true)
    })

    test('does not check capability or call refresh', async () => {
      const { updateDeck } = useDeckActions()
      await updateDeck({ id: 1, title: 'Updated' })

      expect(refreshMock).not.toHaveBeenCalled()
      expect(mockCreateDeckCapability).not.toHaveBeenCalled()
    })
  })
})

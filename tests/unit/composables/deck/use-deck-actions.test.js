import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { useDeckActions } from '@/composables/deck/use-deck-actions'

const { mockFetchMemberDeckCount, mockUpsertDeck, mockCreateDeckCapability, mockWarn } = vi.hoisted(
  () => ({
    mockFetchMemberDeckCount: vi.fn(),
    mockUpsertDeck: vi.fn().mockResolvedValue(undefined),
    mockCreateDeckCapability: vi.fn(),
    mockWarn: vi.fn()
  })
)

vi.mock('@/api/decks', () => ({
  fetchMemberDeckCount: mockFetchMemberDeckCount,
  upsertDeck: mockUpsertDeck
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
    mockFetchMemberDeckCount.mockReset()
    mockUpsertDeck.mockReset()
    mockUpsertDeck.mockResolvedValue(undefined)
    mockCreateDeckCapability.mockReset()
    mockWarn.mockReset()
    mockWarn.mockReturnValue(makeAlertResponse())
  })

  describe('createDeck', () => {
    test('calls upsertDeck and returns true when capability check passes', async () => {
      mockFetchMemberDeckCount.mockResolvedValue(2)
      mockCreateDeckCapability.mockReturnValue(true)

      const { createDeck } = useDeckActions()
      const result = await createDeck({ title: 'New Deck' })

      expect(mockCreateDeckCapability).toHaveBeenCalledWith(2)
      expect(mockUpsertDeck).toHaveBeenCalledWith({ title: 'New Deck' })
      expect(mockWarn).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('opens warn alert and returns false when capability check fails', async () => {
      mockFetchMemberDeckCount.mockResolvedValue(5)
      mockCreateDeckCapability.mockReturnValue(false)

      const { createDeck } = useDeckActions()
      const result = await createDeck({ title: 'Blocked Deck' })

      expect(mockWarn).toHaveBeenCalledWith({
        title: 'errors.deck-limit-reached.title',
        message: 'errors.deck-limit-reached.message'
      })
      expect(mockUpsertDeck).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    test('awaits the alert response before resolving', async () => {
      mockFetchMemberDeckCount.mockResolvedValue(5)
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

      expect(mockUpsertDeck).toHaveBeenCalledWith({ id: 1, title: 'Updated' })
      expect(result).toBe(true)
    })

    test('does not check capability or fetch count', async () => {
      const { updateDeck } = useDeckActions()
      await updateDeck({ id: 1, title: 'Updated' })

      expect(mockFetchMemberDeckCount).not.toHaveBeenCalled()
      expect(mockCreateDeckCapability).not.toHaveBeenCalled()
    })
  })
})

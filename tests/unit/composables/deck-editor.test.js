import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { useDeckEditor } from '@/composables/deck-editor'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockUpsertDeck } = vi.hoisted(() => ({
  mockUpsertDeck: vi.fn().mockResolvedValue(undefined)
}))

const { mockDeleteDeck } = vi.hoisted(() => ({
  mockDeleteDeck: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@/api/decks', () => ({
  upsertDeck: mockUpsertDeck,
  deleteDeck: mockDeleteDeck
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeDeck(overrides = {}) {
  return {
    id: 1,
    title: 'My Deck',
    description: 'A description',
    is_public: true,
    updated_at: '2026-01-01T00:00:00Z',
    study_config: { study_all_cards: false, retry_failed_cards: true },
    cover_config: { color: '#ff0000' },
    ...overrides
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useDeckEditor', () => {
  beforeEach(() => {
    mockUpsertDeck.mockClear()
    mockDeleteDeck.mockClear()
  })

  // ── Initialization ─────────────────────────────────────────────────────────

  describe('initialization', () => {
    test('initializes settings from deck fields', () => {
      const deck = makeDeck()
      const { settings } = useDeckEditor(deck)

      expect(settings.id).toBe(1)
      expect(settings.title).toBe('My Deck')
      expect(settings.description).toBe('A description')
      expect(settings.is_public).toBe(true)
    })

    test('initializes config from deck.study_config', () => {
      const deck = makeDeck({
        study_config: { study_all_cards: true, retry_failed_cards: false }
      })
      const { config } = useDeckEditor(deck)

      expect(config.study_all_cards).toBe(true)
      expect(config.retry_failed_cards).toBe(false)
    })

    test('initializes config with defaults when deck has no study_config', () => {
      const deck = makeDeck({ study_config: undefined })
      const { config } = useDeckEditor(deck)

      expect(config.study_all_cards).toBe(false)
      expect(config.retry_failed_cards).toBe(true)
    })

    test('initializes cover from deck.cover_config', () => {
      const deck = makeDeck({ cover_config: { color: '#abc123' } })
      const { cover } = useDeckEditor(deck)

      expect(cover.color).toBe('#abc123')
    })

    test('initializes cover as empty object when deck has no cover_config', () => {
      const deck = makeDeck({ cover_config: undefined })
      const { cover } = useDeckEditor(deck)

      expect(cover).toEqual({})
    })

    test('works with no deck argument', () => {
      const { settings, config, cover } = useDeckEditor()

      expect(settings.id).toBeUndefined()
      expect(settings.title).toBeUndefined()
      expect(config.study_all_cards).toBe(false)
      expect(config.retry_failed_cards).toBe(true)
      expect(cover).toEqual({})
    })
  })

  // ── saveDeck ───────────────────────────────────────────────────────────────

  describe('saveDeck', () => {
    test('calls upsertDeck with study_config key', async () => {
      const deck = makeDeck({
        study_config: { study_all_cards: true, retry_failed_cards: false }
      })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      expect(mockUpsertDeck).toHaveBeenCalledOnce()
      const [arg] = mockUpsertDeck.mock.calls[0]
      expect(arg.study_config).toEqual({ study_all_cards: true, retry_failed_cards: false })
    })

    test('calls upsertDeck with cover_config key', async () => {
      const deck = makeDeck({ cover_config: { color: '#ff0000' } })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      expect(mockUpsertDeck).toHaveBeenCalledOnce()
      const [arg] = mockUpsertDeck.mock.calls[0]
      expect(arg.cover_config).toEqual({ color: '#ff0000' })
    })

    test('calls upsertDeck with settings fields', async () => {
      const deck = makeDeck({ title: 'Updated Title', is_public: false })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      const [arg] = mockUpsertDeck.mock.calls[0]
      expect(arg.title).toBe('Updated Title')
      expect(arg.is_public).toBe(false)
    })

    test('reactive config changes are reflected in saveDeck payload', async () => {
      const deck = makeDeck({
        study_config: { study_all_cards: false, retry_failed_cards: true }
      })
      const { config, saveDeck } = useDeckEditor(deck)

      config.study_all_cards = true

      await saveDeck()

      const [arg] = mockUpsertDeck.mock.calls[0]
      expect(arg.study_config.study_all_cards).toBe(true)
    })
  })

  // ── deleteDeck ─────────────────────────────────────────────────────────────

  describe('deleteDeck', () => {
    test('calls the delete API with the deck id', async () => {
      const deck = makeDeck({ id: 42 })
      const { deleteDeck } = useDeckEditor(deck)

      await deleteDeck()

      expect(mockDeleteDeck).toHaveBeenCalledWith(42)
    })

    test('does not call delete API when deck has no id', async () => {
      const deck = makeDeck({ id: undefined })
      const { deleteDeck } = useDeckEditor(deck)

      await deleteDeck()

      expect(mockDeleteDeck).not.toHaveBeenCalled()
    })

    test('does not throw when delete API rejects', async () => {
      mockDeleteDeck.mockRejectedValueOnce(new Error('Network error'))
      const deck = makeDeck({ id: 1 })
      const { deleteDeck } = useDeckEditor(deck)

      await expect(deleteDeck()).resolves.toBeUndefined()
    })
  })

  // ── uploadImage / removeImage ──────────────────────────────────────────────

  describe('image management', () => {
    test('uploadImage accepts a File without throwing', () => {
      const { uploadImage } = useDeckEditor()
      const file = new File([''], 'cover.png', { type: 'image/png' })

      expect(() => uploadImage(file)).not.toThrow()
    })

    test('removeImage can be called without throwing', () => {
      const { removeImage } = useDeckEditor()

      expect(() => removeImage()).not.toThrow()
    })
  })
})

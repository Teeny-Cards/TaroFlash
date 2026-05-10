import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { useDeckEditor } from '@/composables/deck-editor'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockCreateDeck, mockUpdateDeck } = vi.hoisted(() => ({
  mockCreateDeck: vi.fn().mockResolvedValue(true),
  mockUpdateDeck: vi.fn().mockResolvedValue(true)
}))

const { mockDeleteDeck, mockDeleteIsLoading } = vi.hoisted(() => {
  const ref = { value: false }
  return {
    mockDeleteDeck: vi.fn().mockResolvedValue(undefined),
    mockDeleteIsLoading: ref
  }
})

const { mockResetReviews, mockResetReviewsIsLoading } = vi.hoisted(() => ({
  mockResetReviews: vi.fn().mockResolvedValue(undefined),
  mockResetReviewsIsLoading: { value: false }
}))

const { mockUploadImage } = vi.hoisted(() => ({
  mockUploadImage: vi.fn().mockResolvedValue('https://cdn.example.com/cover.jpg')
}))

const { mockEmitSfx } = vi.hoisted(() => ({
  mockEmitSfx: vi.fn()
}))

const TEST_MEMBER_ID = '11111111-1111-1111-1111-111111111111'

vi.mock('@/api/decks', () => ({
  useDeleteDeckMutation: () => ({
    mutate: mockDeleteDeck,
    mutateAsync: mockDeleteDeck,
    isLoading: mockDeleteIsLoading
  })
}))

vi.mock('@/composables/deck/use-deck-actions', () => ({
  useDeckActions: () => ({
    createDeck: mockCreateDeck,
    updateDeck: mockUpdateDeck
  })
}))

vi.mock('@/api/media', () => ({
  useUploadImageMutation: () => ({ mutate: mockUploadImage, mutateAsync: mockUploadImage })
}))

vi.mock('@/api/reviews', () => ({
  useResetDeckReviewsMutation: () => ({
    mutate: mockResetReviews,
    mutateAsync: mockResetReviews,
    isLoading: mockResetReviewsIsLoading
  })
}))

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({ id: TEST_MEMBER_ID })
}))

vi.mock('@/sfx/bus', () => ({
  emitSfx: mockEmitSfx
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
    mockCreateDeck.mockClear()
    mockCreateDeck.mockResolvedValue(true)
    mockUpdateDeck.mockClear()
    mockUpdateDeck.mockResolvedValue(true)
    mockDeleteDeck.mockClear()
    mockResetReviews.mockClear()
    mockResetReviews.mockResolvedValue(undefined)
    mockUploadImage.mockClear()
    mockUploadImage.mockResolvedValue('https://cdn.example.com/cover.jpg')
    mockEmitSfx.mockClear()
    sessionStorage.clear()
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
        study_config: { study_all_cards: true }
      })
      const { config } = useDeckEditor(deck)

      expect(config.study_all_cards).toBe(true)
    })

    test('initializes config with defaults when deck has no study_config', () => {
      const deck = makeDeck({ study_config: undefined })
      const { config } = useDeckEditor(deck)

      expect(config.study_all_cards).toBe(false)
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

      expect(mockUpdateDeck).toHaveBeenCalledOnce()
      const [arg] = mockUpdateDeck.mock.calls[0]
      expect(arg.study_config).toMatchObject({
        study_all_cards: true,
        retry_failed_cards: false
      })
    })

    test('calls upsertDeck with cover_config key', async () => {
      const deck = makeDeck({ cover_config: { color: '#ff0000' } })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      expect(mockUpdateDeck).toHaveBeenCalledOnce()
      const [arg] = mockUpdateDeck.mock.calls[0]
      expect(arg.cover_config).toEqual({ color: '#ff0000' })
    })

    test('calls upsertDeck with settings fields', async () => {
      const deck = makeDeck({ title: 'Updated Title', is_public: false })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      const [arg] = mockUpdateDeck.mock.calls[0]
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

      const [arg] = mockUpdateDeck.mock.calls[0]
      expect(arg.study_config.study_all_cards).toBe(true)
    })

    test('routes to createDeck when the deck has no id', async () => {
      const { saveDeck } = useDeckEditor()

      await saveDeck()

      expect(mockCreateDeck).toHaveBeenCalledOnce()
      expect(mockUpdateDeck).not.toHaveBeenCalled()
    })

    test('routes to updateDeck when the deck has an id', async () => {
      const { saveDeck } = useDeckEditor(makeDeck({ id: 42 }))

      await saveDeck()

      expect(mockUpdateDeck).toHaveBeenCalledOnce()
      expect(mockCreateDeck).not.toHaveBeenCalled()
    })

    test('returns the boolean result from the action', async () => {
      mockCreateDeck.mockResolvedValueOnce(false)
      const { saveDeck } = useDeckEditor()

      await expect(saveDeck()).resolves.toBe(false)
    })

    test('returns true from updateDeck by default', async () => {
      const { saveDeck } = useDeckEditor(makeDeck({ id: 1 }))

      await expect(saveDeck()).resolves.toBe(true)
    })
  })

  // ── card_attributes ────────────────────────────────────────────────────────

  describe('card_attributes', () => {
    test('initializes card_attributes from deck.card_attributes', () => {
      const deck = makeDeck({
        card_attributes: {
          front: { text_size: 'huge', horizontal_alignment: 'left' },
          back: { text_size: 'small' }
        }
      })
      const { card_attributes } = useDeckEditor(deck)

      expect(card_attributes.front.text_size).toBe('huge')
      expect(card_attributes.front.horizontal_alignment).toBe('left')
      expect(card_attributes.back.text_size).toBe('small')
    })

    test('initializes card_attributes with empty sides when deck has no card_attributes', () => {
      const deck = makeDeck({ card_attributes: undefined })
      const { card_attributes } = useDeckEditor(deck)

      expect(card_attributes).toEqual({ front: {}, back: {} })
    })

    test('initializes card_attributes with empty sides with no deck argument', () => {
      const { card_attributes } = useDeckEditor()

      expect(card_attributes).toEqual({ front: {}, back: {} })
    })

    test('saveDeck includes card_attributes in payload', async () => {
      const deck = makeDeck({
        card_attributes: {
          front: { text_size: 'ginormous', vertical_alignment: 'bottom' },
          back: { text_size: 'medium' }
        }
      })
      const { saveDeck } = useDeckEditor(deck)

      await saveDeck()

      const [arg] = mockUpdateDeck.mock.calls[0]
      expect(arg.card_attributes).toEqual({
        front: { text_size: 'ginormous', vertical_alignment: 'bottom' },
        back: { text_size: 'medium' }
      })
    })

    test('reactive card_attributes changes are reflected in saveDeck payload', async () => {
      const deck = makeDeck({
        card_attributes: { front: { text_size: 'small' }, back: {} }
      })
      const { card_attributes, saveDeck } = useDeckEditor(deck)

      card_attributes.front.text_size = 'x-large'
      card_attributes.front.horizontal_alignment = 'right'
      card_attributes.back.vertical_alignment = 'top'

      await saveDeck()

      const [arg] = mockUpdateDeck.mock.calls[0]
      expect(arg.card_attributes.front.text_size).toBe('x-large')
      expect(arg.card_attributes.front.horizontal_alignment).toBe('right')
      expect(arg.card_attributes.back.vertical_alignment).toBe('top')
    })
  })

  // ── is_dirty ───────────────────────────────────────────────────────────────

  describe('is_dirty', () => {
    test('is false right after init for an existing deck (no edits yet)', () => {
      const { is_dirty } = useDeckEditor(makeDeck())
      expect(is_dirty.value).toBe(false)
    })

    test('is false right after init for a new deck (no edits yet)', () => {
      const { is_dirty } = useDeckEditor()
      expect(is_dirty.value).toBe(false)
    })

    test('flips to true when a settings field is mutated', () => {
      const { settings, is_dirty } = useDeckEditor(makeDeck())
      settings.title = 'Renamed'
      expect(is_dirty.value).toBe(true)
    })

    test('flips to true when a study_config field is mutated', () => {
      const { config, is_dirty } = useDeckEditor(
        makeDeck({ study_config: { study_all_cards: false } })
      )
      config.study_all_cards = true
      expect(is_dirty.value).toBe(true)
    })

    test('flips to true when cover_config is mutated', () => {
      const { cover, is_dirty } = useDeckEditor(makeDeck())
      cover.color = '#000000'
      expect(is_dirty.value).toBe(true)
    })

    test('flips to true when card_attributes is mutated', () => {
      const { card_attributes, is_dirty } = useDeckEditor(makeDeck())
      card_attributes.front.text_size = 6
      expect(is_dirty.value).toBe(true)
    })

    test('flips to true after setCoverImage updates bg_image', async () => {
      const { setCoverImage, is_dirty } = useDeckEditor(makeDeck())
      await setCoverImage({
        preview: 'p',
        file: new File([''], 'x.png', { type: 'image/png' })
      })
      expect(is_dirty.value).toBe(true)
    })

    test('returns false again when a mutation is reverted to the original value', () => {
      const deck = makeDeck({ title: 'Original' })
      const { settings, is_dirty } = useDeckEditor(deck)
      settings.title = 'Changed'
      expect(is_dirty.value).toBe(true)
      settings.title = 'Original'
      expect(is_dirty.value).toBe(false)
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

    test('resolves to true on success', async () => {
      const { deleteDeck } = useDeckEditor(makeDeck({ id: 1 }))
      await expect(deleteDeck()).resolves.toBe(true)
    })

    test('does not call delete API when deck has no id, and resolves false', async () => {
      const deck = makeDeck({ id: undefined })
      const { deleteDeck } = useDeckEditor(deck)

      await expect(deleteDeck()).resolves.toBe(false)
      expect(mockDeleteDeck).not.toHaveBeenCalled()
    })

    test('resolves to false (does not throw) when delete API rejects', async () => {
      mockDeleteDeck.mockRejectedValueOnce(new Error('Network error'))
      const deck = makeDeck({ id: 1 })
      const { deleteDeck } = useDeckEditor(deck)

      await expect(deleteDeck()).resolves.toBe(false)
    })

    test('exposes the mutation isLoading ref as `deleting`', () => {
      const { deleting } = useDeckEditor(makeDeck({ id: 1 }))
      expect(deleting).toBe(mockDeleteIsLoading)
    })
  })

  // ── resetReviews ───────────────────────────────────────────────────────────

  describe('resetReviews', () => {
    test('calls the reset mutation with the deck id', async () => {
      const { resetReviews } = useDeckEditor(makeDeck({ id: 42 }))

      await resetReviews()

      expect(mockResetReviews).toHaveBeenCalledWith(42)
    })

    test('resolves to true on success', async () => {
      const { resetReviews } = useDeckEditor(makeDeck({ id: 1 }))
      await expect(resetReviews()).resolves.toBe(true)
    })

    test('does not call the mutation when deck has no id, and resolves false', async () => {
      const { resetReviews } = useDeckEditor(makeDeck({ id: undefined }))

      await expect(resetReviews()).resolves.toBe(false)
      expect(mockResetReviews).not.toHaveBeenCalled()
    })

    test('resolves to false (does not throw) when the mutation rejects', async () => {
      mockResetReviews.mockRejectedValueOnce(new Error('Network error'))
      const { resetReviews } = useDeckEditor(makeDeck({ id: 1 }))

      await expect(resetReviews()).resolves.toBe(false)
    })

    test('exposes the mutation isLoading ref as `resetting_reviews`', () => {
      const { resetting_reviews } = useDeckEditor(makeDeck({ id: 1 }))
      expect(resetting_reviews).toBe(mockResetReviewsIsLoading)
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

  // ── cover_image_preview initialization ────────────────────────────────────

  describe('cover_image_preview initialization', () => {
    test('initializes cover_image_preview from deck.cover_config.bg_image', () => {
      const deck = makeDeck({ cover_config: { bg_image: 'https://example.com/img.jpg' } })
      const { cover_image_preview } = useDeckEditor(deck)

      expect(cover_image_preview.value).toBe('https://example.com/img.jpg')
    })

    test('cover_image_preview is undefined when deck has no bg_image', () => {
      const deck = makeDeck({ cover_config: {} })
      const { cover_image_preview } = useDeckEditor(deck)

      expect(cover_image_preview.value).toBeUndefined()
    })

    test('cover_image_loading starts as false', () => {
      const { cover_image_loading } = useDeckEditor()

      expect(cover_image_loading.value).toBe(false)
    })
  })

  // ── setCoverImage ──────────────────────────────────────────────────────────

  describe('setCoverImage', () => {
    function makePayload(overrides = {}) {
      return {
        preview: 'data:image/png;base64,abc',
        file: new File([''], 'cover.png', { type: 'image/png' }),
        ...overrides
      }
    }

    test('sets cover_image_preview to payload.preview immediately (before upload)', async () => {
      let resolveUpload
      mockUploadImage.mockReturnValueOnce(
        new Promise((r) => {
          resolveUpload = r
        })
      )

      const { setCoverImage, cover_image_preview } = useDeckEditor()
      const payload = makePayload()

      const promise = setCoverImage(payload)

      expect(cover_image_preview.value).toBe(payload.preview)

      resolveUpload('https://cdn.example.com/cover.jpg')
      await promise
    })

    test('sets cover_image_loading to true during upload', async () => {
      let resolveUpload
      mockUploadImage.mockReturnValueOnce(
        new Promise((r) => {
          resolveUpload = r
        })
      )

      const { setCoverImage, cover_image_loading } = useDeckEditor()

      const promise = setCoverImage(makePayload())

      expect(cover_image_loading.value).toBe(true)

      resolveUpload('https://cdn.example.com/cover.jpg')
      await promise
    })

    test('sets cover_image_loading back to false after upload completes', async () => {
      const { setCoverImage, cover_image_loading } = useDeckEditor()

      await setCoverImage(makePayload())

      expect(cover_image_loading.value).toBe(false)
    })

    test('sets cover_image_loading back to false when upload fails', async () => {
      mockUploadImage.mockRejectedValueOnce(new Error('Upload failed'))
      const { setCoverImage, cover_image_loading } = useDeckEditor()

      await expect(setCoverImage(makePayload())).rejects.toThrow('Upload failed')

      expect(cover_image_loading.value).toBe(false)
    })

    test('updates cover.bg_image with the returned URL', async () => {
      const { setCoverImage, cover } = useDeckEditor()

      await setCoverImage(makePayload())

      expect(cover.bg_image).toBe('https://cdn.example.com/cover.jpg')
    })

    test('updates cover_image_preview with the returned URL after upload', async () => {
      const { setCoverImage, cover_image_preview } = useDeckEditor()

      await setCoverImage(makePayload())

      expect(cover_image_preview.value).toBe('https://cdn.example.com/cover.jpg')
    })

    test('uses deck id in storage path when deck has an id', async () => {
      const deck = makeDeck({ id: 42 })
      const { setCoverImage } = useDeckEditor(deck)

      await setCoverImage(makePayload())

      expect(mockUploadImage).toHaveBeenCalledWith({
        bucket: 'decks',
        path: `${TEST_MEMBER_ID}/covers/42`,
        file: expect.any(File)
      })
    })

    test('uses draft path when deck has no id', async () => {
      const deck = makeDeck({ id: undefined })
      const { setCoverImage } = useDeckEditor(deck)

      await setCoverImage(makePayload())

      const [{ path }] = mockUploadImage.mock.calls[0]
      expect(path).toMatch(new RegExp(`^${TEST_MEMBER_ID}/covers/draft-`))
    })
  })

  // ── removeCoverImage ───────────────────────────────────────────────────────

  describe('removeCoverImage', () => {
    test('clears cover_image_preview', () => {
      const deck = makeDeck({ cover_config: { bg_image: 'https://example.com/img.jpg' } })
      const { removeCoverImage, cover_image_preview } = useDeckEditor(deck)

      removeCoverImage()

      expect(cover_image_preview.value).toBeUndefined()
    })

    test('clears cover.bg_image', () => {
      const deck = makeDeck({ cover_config: { bg_image: 'https://example.com/img.jpg' } })
      const { removeCoverImage, cover } = useDeckEditor(deck)

      removeCoverImage()

      expect(cover.bg_image).toBeUndefined()
    })
  })

  // ── active_side / setActiveSide ─────────────────────────────────────────────

  describe('active_side / setActiveSide', () => {
    test('initializes active_side to "cover"', () => {
      const { active_side } = useDeckEditor(makeDeck())
      expect(active_side.value).toBe('cover')
    })

    test('setActiveSide updates active_side and emits sfx', () => {
      const { active_side, setActiveSide } = useDeckEditor(makeDeck())

      setActiveSide('front')

      expect(active_side.value).toBe('front')
      expect(mockEmitSfx).toHaveBeenCalledWith('ui.slide_up')
    })

    test('setActiveSide is a no-op when side is already active', () => {
      const { active_side, setActiveSide } = useDeckEditor(makeDeck())

      setActiveSide('cover')

      expect(active_side.value).toBe('cover')
      expect(mockEmitSfx).not.toHaveBeenCalled()
    })

    test('setActiveSide cycles through cover/front/back', () => {
      const { active_side, setActiveSide } = useDeckEditor(makeDeck())

      setActiveSide('front')
      setActiveSide('back')
      setActiveSide('cover')

      expect(active_side.value).toBe('cover')
      expect(mockEmitSfx).toHaveBeenCalledTimes(3)
    })
  })
})

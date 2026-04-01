import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

vi.mock('@/api/cards', () => ({
  upsertCard: vi.fn().mockResolvedValue(undefined),
  deleteCards: vi.fn().mockResolvedValue(undefined),
  reserveCard: vi.fn().mockResolvedValue({ out_rank: 1, out_id: 42 })
}))

// Call the function immediately so update() resolves synchronously in tests
vi.mock('@/utils/debounce', () => ({
  debounce: vi.fn((fn) => fn())
}))

import CardRecord from '@/utils/card-record'
import { upsertCard, reserveCard } from '@/api/cards'
import { debounce } from '@/utils/debounce'

function makeCard(overrides = {}) {
  return {
    id: 1,
    deck_id: 10,
    front_text: 'Front',
    back_text: 'Back',
    front_delta: null,
    back_delta: null,
    attributes: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    rank: 0,
    member_id: 5,
    front_image_path: null,
    back_image_path: null,
    review: null,
    ...overrides
  }
}

describe('CardRecord', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    test('copies all card properties', () => {
      const card = makeCard()
      const record = new CardRecord(card)
      expect(record.id).toBe(1)
      expect(record.deck_id).toBe(10)
      expect(record.front_text).toBe('Front')
      expect(record.back_text).toBe('Back')
      expect(record.rank).toBe(0)
      expect(record.member_id).toBe(5)
      expect(record.front_image_path).toBeNull()
      expect(record.back_image_path).toBeNull()
      expect(record.review).toBeNull()
    })
  })

  describe('static create', () => {
    test('calls reserveCard with deck_id and optional neighbour ids', async () => {
      await CardRecord.create(10, 1, 2)
      expect(reserveCard).toHaveBeenCalledWith(10, 1, 2)
    })

    test('returns a CardRecord with id and rank from reserveCard', async () => {
      const record = await CardRecord.create(10)
      expect(record).toBeInstanceOf(CardRecord)
      expect(record.id).toBe(42)
      expect(record.rank).toBe(1)
    })
  })

  describe('update', () => {
    test('calls upsertCard via debounce when values differ', async () => {
      const record = new CardRecord(makeCard())
      await record.update({ front_text: 'Updated' })
      expect(debounce).toHaveBeenCalled()
      expect(upsertCard).toHaveBeenCalled()
    })

    test('skips upsert when values are unchanged', async () => {
      const record = new CardRecord(makeCard())
      await record.update({ front_text: 'Front' }) // same as makeCard default
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('skips upsert when id is falsy', async () => {
      const record = new CardRecord(makeCard({ id: 0 }))
      await record.update({ front_text: 'New' })
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('assigns new values to the record before saving', async () => {
      const record = new CardRecord(makeCard())
      await record.update({ front_text: 'Changed', back_text: 'Also Changed' })
      expect(record.front_text).toBe('Changed')
      expect(record.back_text).toBe('Also Changed')
    })

    test('uses card id as debounce key', async () => {
      const record = new CardRecord(makeCard({ id: 99 }))
      await record.update({ front_text: 'X' })
      expect(debounce).toHaveBeenCalledWith(expect.any(Function), { key: 'card-99' })
    })

    test('ignores undefined values when comparing — does not trigger save', async () => {
      const record = new CardRecord(makeCard())
      await record.update({ front_text: undefined })
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('excludes undefined properties from upsert payload', async () => {
      // attributes is undefined (not set on card)
      const record = new CardRecord(makeCard({ attributes: undefined }))
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect('attributes' in payload).toBe(false)
    })

    test('keeps null properties in upsert payload', async () => {
      const record = new CardRecord(makeCard({ front_delta: null }))
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect('front_delta' in payload).toBe(true)
      expect(payload.front_delta).toBeNull()
    })

    test('payload always includes the record id', async () => {
      const record = new CardRecord(makeCard({ id: 7 }))
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect(payload.id).toBe(7)
    })
  })
})

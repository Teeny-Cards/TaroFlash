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
import { card } from '../../fixtures/card'

describe('CardRecord', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    test('copies all card properties', () => {
      const c = card.one()
      const record = new CardRecord(c)
      expect(record.id).toBe(c.id)
      expect(record.deck_id).toBe(c.deck_id)
      expect(record.front_text).toBe(c.front_text)
      expect(record.back_text).toBe(c.back_text)
      expect(record.rank).toBe(c.rank)
      expect(record.member_id).toBe(c.member_id)
      expect(record.front_image_path).toBeNull()
      expect(record.back_image_path).toBeNull()
      expect(record.review).toBeNull()
    })
  })

  describe('static reserve', () => {
    test('calls reserveCard with deck_id and optional neighbour ids', async () => {
      await CardRecord.reserve(10, 1, 2)
      expect(reserveCard).toHaveBeenCalledWith(10, 1, 2)
    })

    test('returns a CardRecord with id and rank from reserveCard', async () => {
      const record = await CardRecord.reserve(10)
      expect(record).toBeInstanceOf(CardRecord)
      expect(record.id).toBe(42)
      expect(record.rank).toBe(1)
    })
  })

  describe('update', () => {
    test('calls upsertCard via debounce when values differ', async () => {
      const record = new CardRecord(card.one())
      await record.update({ front_text: 'Updated' })
      expect(debounce).toHaveBeenCalled()
      expect(upsertCard).toHaveBeenCalled()
    })

    test('skips upsert when values are unchanged', async () => {
      const c = card.one()
      const record = new CardRecord(c)
      await record.update({ front_text: c.front_text })
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('skips upsert when id is falsy', async () => {
      const record = new CardRecord(card.one({ overrides: { id: 0 } }))
      await record.update({ front_text: 'New' })
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('assigns new values to the record before saving', async () => {
      const record = new CardRecord(card.one())
      await record.update({ front_text: 'Changed', back_text: 'Also Changed' })
      expect(record.front_text).toBe('Changed')
      expect(record.back_text).toBe('Also Changed')
    })

    test('uses card id as debounce key', async () => {
      const c = card.one()
      const record = new CardRecord(c)
      await record.update({ front_text: 'X' })
      expect(debounce).toHaveBeenCalledWith(expect.any(Function), { key: `card-${c.id}` })
    })

    test('ignores undefined values when comparing — does not trigger save', async () => {
      const record = new CardRecord(card.one())
      await record.update({ front_text: undefined })
      expect(upsertCard).not.toHaveBeenCalled()
    })

    test('excludes undefined properties from upsert payload', async () => {
      const record = new CardRecord(card.one({ overrides: { member_id: undefined } }))
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect('member_id' in payload).toBe(false)
    })

    test('keeps null properties in upsert payload', async () => {
      const record = new CardRecord(card.one({ overrides: { back_text: null } }))
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect('back_text' in payload).toBe(true)
      expect(payload.back_text).toBeNull()
    })

    test('payload always includes the record id', async () => {
      const c = card.one()
      const record = new CardRecord(c)
      await record.update({ front_text: 'X' })
      const payload = vi.mocked(upsertCard).mock.calls[0][0]
      expect(payload.id).toBe(c.id)
    })
  })
})

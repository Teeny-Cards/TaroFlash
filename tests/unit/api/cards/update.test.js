import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { singleMock } = vi.hoisted(() => ({
  singleMock: vi.fn().mockResolvedValue({ data: {}, error: null })
}))

// Fake supabase client that captures the upsert payload via the `single()` mock.
vi.mock('@/supabase-client', () => ({
  supabase: {
    from: () => ({
      upsert: (payload) => {
        singleMock.__lastPayload = payload
        return {
          select: () => ({
            single: () => singleMock({ data: payload, error: null })
          })
        }
      }
    })
  }
}))

vi.mock('@/utils/logger', () => ({ default: { error: vi.fn() } }))
vi.mock('@/api/media', () => ({
  uploadImage: vi.fn(),
  insertMedia: vi.fn(),
  deleteMediaByPath: vi.fn(),
  deduplicateSlotMedia: vi.fn()
}))

// Call the debounced fn immediately so saveCard resolves synchronously.
vi.mock('@/utils/debounce', () => ({
  debounce: vi.fn((fn) => fn())
}))

import { saveCard } from '@/api/cards/update'
import { debounce } from '@/utils/debounce'

function makeCard(overrides = {}) {
  return {
    id: 1,
    deck_id: 10,
    front_text: 'Q',
    back_text: 'A',
    rank: 1,
    member_id: 'm1',
    ...overrides
  }
}

function lastUpsertPayload() {
  return singleMock.__lastPayload
}

describe('saveCard', () => {
  beforeEach(() => {
    singleMock.mockClear()
    singleMock.__lastPayload = undefined
    vi.mocked(debounce).mockClear()
  })

  test('mutates card in place and upserts when values change', async () => {
    const card = makeCard()
    await saveCard(card, { front_text: 'Updated' })
    expect(card.front_text).toBe('Updated')
    expect(singleMock).toHaveBeenCalled()
  })

  test('skips upsert when values are unchanged', async () => {
    const card = makeCard()
    await saveCard(card, { front_text: card.front_text })
    expect(singleMock).not.toHaveBeenCalled()
  })

  test('skips upsert when card has no id', async () => {
    const card = makeCard({ id: 0 })
    await saveCard(card, { front_text: 'New' })
    expect(singleMock).not.toHaveBeenCalled()
  })

  test('keys the debounce by card id so concurrent card edits do not supersede each other', async () => {
    const card = makeCard()
    await saveCard(card, { front_text: 'X' })
    expect(debounce).toHaveBeenCalledWith(expect.any(Function), { key: `card-${card.id}` })
  })

  test('sends the built payload (runtime-only fields stripped)', async () => {
    const card = { ...makeCard(), review: { due: new Date() }, state: 'unreviewed' }
    await saveCard(card, { front_text: 'X' })
    const payload = lastUpsertPayload()
    expect('review' in payload).toBe(false)
    expect('state' in payload).toBe(false)
  })
})

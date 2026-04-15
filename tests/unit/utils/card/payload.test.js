import { describe, test, expect } from 'vite-plus/test'
import { buildCardPayload, hasCardChanges } from '@/utils/card/payload'

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

describe('buildCardPayload', () => {
  test('includes allow-listed columns', () => {
    expect(buildCardPayload(makeCard())).toEqual({
      id: 1,
      deck_id: 10,
      front_text: 'Q',
      back_text: 'A',
      rank: 1,
      member_id: 'm1'
    })
  })

  test('omits undefined values', () => {
    const payload = buildCardPayload(makeCard({ member_id: undefined }))
    expect('member_id' in payload).toBe(false)
  })

  test('keeps null values', () => {
    const payload = buildCardPayload(makeCard({ back_text: null }))
    expect('back_text' in payload).toBe(true)
    expect(payload.back_text).toBeNull()
  })

  test('strips non-column fields (review, preview, state)', () => {
    const payload = buildCardPayload({
      ...makeCard(),
      review: { due: new Date() },
      preview: { Again: {} },
      state: 'unreviewed'
    })
    expect('review' in payload).toBe(false)
    expect('preview' in payload).toBe(false)
    expect('state' in payload).toBe(false)
  })
})

describe('hasCardChanges', () => {
  test('returns true when a value differs', () => {
    expect(hasCardChanges(makeCard(), { front_text: 'Updated' })).toBe(true)
  })

  test('returns false when all values match the card', () => {
    const card = makeCard()
    expect(hasCardChanges(card, { front_text: card.front_text, back_text: card.back_text })).toBe(
      false
    )
  })

  test('ignores undefined values', () => {
    expect(hasCardChanges(makeCard(), { front_text: undefined })).toBe(false)
  })
})

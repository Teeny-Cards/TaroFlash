import { describe, test, expect } from 'vite-plus/test'
import { buildMemberPayload, hasMemberChanges } from '@/utils/member/payload'

describe('member/payload', () => {
  describe('buildMemberPayload', () => {
    test('returns the settings values when both fields are present', () => {
      const payload = buildMemberPayload({
        settings: { display_name: 'Chris', description: 'hi' }
      })
      expect(payload).toEqual({ display_name: 'Chris', description: 'hi' })
    })

    test('falls back to empty-string defaults when display_name is missing', () => {
      const payload = buildMemberPayload({ settings: { description: 'hi' } })
      expect(payload).toEqual({ display_name: '', description: 'hi' })
    })

    test('falls back to empty-string defaults when description is missing', () => {
      const payload = buildMemberPayload({ settings: { display_name: 'Chris' } })
      expect(payload).toEqual({ display_name: 'Chris', description: '' })
    })

    test('falls back to defaults when both fields are missing', () => {
      const payload = buildMemberPayload({ settings: {} })
      expect(payload).toEqual({ display_name: '', description: '' })
    })

    test('preserves empty strings rather than substituting defaults', () => {
      const payload = buildMemberPayload({ settings: { display_name: '', description: '' } })
      expect(payload).toEqual({ display_name: '', description: '' })
    })
  })

  describe('hasMemberChanges', () => {
    test('returns false when the live state matches the snapshot', () => {
      const snapshot = { display_name: 'Chris', description: 'hi' }
      const changed = hasMemberChanges(
        { settings: { display_name: 'Chris', description: 'hi' } },
        snapshot
      )
      expect(changed).toBe(false)
    })

    test('returns true when display_name diverges', () => {
      const snapshot = { display_name: 'Chris', description: 'hi' }
      const changed = hasMemberChanges(
        { settings: { display_name: 'Other', description: 'hi' } },
        snapshot
      )
      expect(changed).toBe(true)
    })

    test('returns true when description diverges', () => {
      const snapshot = { display_name: 'Chris', description: 'hi' }
      const changed = hasMemberChanges(
        { settings: { display_name: 'Chris', description: 'bye' } },
        snapshot
      )
      expect(changed).toBe(true)
    })

    test('treats a missing field as the default empty string', () => {
      const snapshot = { display_name: 'Chris', description: '' }
      const changed = hasMemberChanges({ settings: { display_name: 'Chris' } }, snapshot)
      expect(changed).toBe(false)
    })
  })
})

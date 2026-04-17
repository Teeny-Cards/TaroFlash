import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const state = vi.hoisted(() => ({ member: null }))

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({
    get id() {
      return state.member?.id
    },
    get plan() {
      return state.member?.plan
    },
    get role() {
      return state.member?.role
    },
    get has_member() {
      return Boolean(state.member?.id)
    }
  })
}))

import { useCan } from '@/composables/use-can'

function setMember(patch) {
  state.member = { id: 'm1', ...patch }
}

describe('useCan', () => {
  beforeEach(() => {
    state.member = null
  })

  describe('useProFeature', () => {
    test('returns true when member plan is paid', () => {
      setMember({ plan: 'paid' })
      const can = useCan()
      expect(can.useProFeature()).toBe(true)
    })

    test('returns false when member plan is free', () => {
      setMember({ plan: 'free' })
      const can = useCan()
      expect(can.useProFeature()).toBe(false)
    })

    test('returns false when member plan is not set', () => {
      const can = useCan()
      expect(can.useProFeature()).toBe(false)
    })

    test('reflects live store state (not captured at call time)', () => {
      const can = useCan()

      setMember({ plan: 'free' })
      expect(can.useProFeature()).toBe(false)

      setMember({ plan: 'paid' })
      expect(can.useProFeature()).toBe(true)
    })
  })

  describe('createDeck', () => {
    test('allows free user under the limit', () => {
      setMember({ plan: 'free' })
      const can = useCan()
      expect(can.createDeck(0)).toBe(true)
      expect(can.createDeck(4)).toBe(true)
    })

    test('blocks free user at the limit', () => {
      setMember({ plan: 'free' })
      const can = useCan()
      expect(can.createDeck(5)).toBe(false)
      expect(can.createDeck(99)).toBe(false)
    })

    test('allows paid user regardless of count', () => {
      setMember({ plan: 'paid' })
      const can = useCan()
      expect(can.createDeck(0)).toBe(true)
      expect(can.createDeck(1_000_000)).toBe(true)
    })

    test('treats unset plan as free', () => {
      const can = useCan()
      expect(can.createDeck(4)).toBe(true)
      expect(can.createDeck(5)).toBe(false)
    })
  })
})

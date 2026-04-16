import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { setActivePinia, createPinia } from 'pinia'
import { useCan } from '@/composables/use-can'
import { useMemberStore } from '@/stores/member'

describe('useCan', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('useProFeature', () => {
    test('returns true when member plan is paid', () => {
      const member = useMemberStore()
      member.plan = 'paid'
      const can = useCan()
      expect(can.useProFeature()).toBe(true)
    })

    test('returns false when member plan is free', () => {
      const member = useMemberStore()
      member.plan = 'free'
      const can = useCan()
      expect(can.useProFeature()).toBe(false)
    })

    test('returns false when member plan is not set', () => {
      const can = useCan()
      expect(can.useProFeature()).toBe(false)
    })

    test('reflects live store state (not captured at call time)', () => {
      const member = useMemberStore()
      const can = useCan()

      member.plan = 'free'
      expect(can.useProFeature()).toBe(false)

      member.plan = 'paid'
      expect(can.useProFeature()).toBe(true)
    })
  })
})

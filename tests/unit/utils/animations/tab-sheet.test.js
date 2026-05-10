import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { mockSet, mockTo } = vi.hoisted(() => ({
  mockSet: vi.fn(),
  mockTo: vi.fn()
}))

vi.mock('gsap', () => ({ gsap: { set: mockSet, to: mockTo } }))

import { tabContentEnter, tabContentLeave, TAB_LEAVE_DURATION } from '@/utils/animations/tab-sheet'

const el = document.createElement('div')
const done = vi.fn()

describe('tab-sheet animations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('tabContentEnter', () => {
    test('primes initial state with negative y offset and zero opacity', () => {
      tabContentEnter(el, done)

      const setCall = mockSet.mock.calls[0]
      expect(setCall[0]).toBe(el)
      expect(setCall[1].y).toBeLessThan(0)
      expect(setCall[1].opacity).toBe(0)
    })

    test('tweens to rest position with full opacity', () => {
      tabContentEnter(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ y: 0, opacity: 1 }))
    })

    test('clears transform/opacity inline styles after enter completes', () => {
      tabContentEnter(el, done)

      expect(mockTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ clearProps: 'transform,opacity' })
      )
    })

    test('calls done via onComplete', () => {
      tabContentEnter(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('tabContentLeave', () => {
    test('exits with positive y offset and zero opacity', () => {
      tabContentLeave(el, done)

      const toCall = mockTo.mock.calls[0]
      expect(toCall[1].y).toBeGreaterThan(0)
      expect(toCall[1].opacity).toBe(0)
    })

    test('does not prime with gsap.set (leave animation)', () => {
      tabContentLeave(el, done)

      expect(mockSet).not.toHaveBeenCalled()
    })

    test('uses TAB_LEAVE_DURATION so consumers can size overlay leaves accordingly', () => {
      tabContentLeave(el, done)

      expect(mockTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ duration: TAB_LEAVE_DURATION })
      )
    })

    test('calls done via onComplete', () => {
      tabContentLeave(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('TAB_LEAVE_DURATION', () => {
    test('is a positive number expressed in seconds', () => {
      expect(TAB_LEAVE_DURATION).toBeGreaterThan(0)
      expect(TAB_LEAVE_DURATION).toBeLessThan(2)
    })
  })
})

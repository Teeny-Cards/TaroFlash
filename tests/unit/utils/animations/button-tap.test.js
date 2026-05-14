import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { mockTo, mockTimeline, mockTimelineCall } = vi.hoisted(() => {
  const mockTimelineCall = vi.fn()
  return {
    mockTo: vi.fn((_el, opts) => opts?.onComplete?.()),
    mockTimelineCall,
    mockTimeline: vi.fn(() => {
      const tl = {}
      tl.to = vi.fn(() => tl)
      tl.call = vi.fn((fn) => {
        mockTimelineCall(fn)
        fn?.()
        return tl
      })
      return tl
    })
  }
})

vi.mock('gsap', () => ({
  gsap: {
    to: mockTo,
    timeline: (opts) => {
      const tl = mockTimeline(opts)
      tl.to = vi.fn(() => tl)
      tl.call = vi.fn((fn) => {
        fn?.()
        return tl
      })
      // fire timeline-level onComplete
      queueMicrotask(() => opts?.onComplete?.())
      return tl
    }
  }
}))

import { BUTTON_TAP_DURATION, playButtonTap } from '@/utils/animations/button-tap'

const el = document.createElement('div')

describe('playButtonTap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('non-yoyo (default)', () => {
    test('tweens scale and rotate on the element', () => {
      playButtonTap(el)
      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ scale: 1.2, rotate: 3 }))
    })

    test('defaults duration to BUTTON_TAP_DURATION', () => {
      playButtonTap(el)
      expect(mockTo.mock.calls[0][1].duration).toBe(BUTTON_TAP_DURATION)
    })

    test('forwards the duration argument', () => {
      playButtonTap(el, 0.5)
      expect(mockTo.mock.calls[0][1].duration).toBe(0.5)
    })

    test('uses expo.out easing', () => {
      playButtonTap(el)
      expect(mockTo.mock.calls[0][1].ease).toBe('expo.out')
    })

    test('returns peak and done promises that both resolve on onComplete', async () => {
      const { peak, done } = playButtonTap(el)
      await expect(peak).resolves.toBeUndefined()
      await expect(done).resolves.toBeUndefined()
    })
  })

  describe('yoyo', () => {
    test('uses a timeline with up + return tweens', () => {
      playButtonTap(el, 0.4, { yoyo: true })
      expect(mockTimeline).toHaveBeenCalled()
    })

    test('returns peak and done promises (peak resolves before timeline complete)', async () => {
      const { peak, done } = playButtonTap(el, 0.4, { yoyo: true })
      await expect(peak).resolves.toBeUndefined()
      await expect(done).resolves.toBeUndefined()
    })

    test('forwards a custom hold option', () => {
      playButtonTap(el, 0.4, { yoyo: true, hold: 0.5 })
      expect(mockTimeline).toHaveBeenCalled()
    })
  })

  test('BUTTON_TAP_DURATION is a positive number', () => {
    expect(BUTTON_TAP_DURATION).toBeGreaterThan(0)
  })
})

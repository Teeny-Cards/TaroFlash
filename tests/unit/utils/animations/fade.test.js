import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { mockFromTo, mockTo } = vi.hoisted(() => ({
  mockFromTo: vi.fn(),
  mockTo: vi.fn()
}))

vi.mock('gsap', () => ({ gsap: { fromTo: mockFromTo, to: mockTo } }))

import { fadeEnter, fadeLeave } from '@/utils/animations/fade'

const el = document.createElement('div')
const done = vi.fn()

describe('fade animations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fadeEnter', () => {
    test('tweens opacity from 0 to 1', () => {
      fadeEnter(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        { opacity: 0 },
        expect.objectContaining({ opacity: 1 })
      )
    })

    test('uses a positive duration', () => {
      fadeEnter(el, done)

      const opts = mockFromTo.mock.calls[0][2]
      expect(opts.duration).toBeGreaterThan(0)
    })

    test('calls done via onComplete', () => {
      fadeEnter(el, done)

      const opts = mockFromTo.mock.calls[0][2]
      expect(opts.onComplete).toBe(done)
    })

    test('does not call gsap.to', () => {
      fadeEnter(el, done)

      expect(mockTo).not.toHaveBeenCalled()
    })
  })

  describe('fadeLeave', () => {
    test('tweens opacity to 0', () => {
      fadeLeave(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ opacity: 0 }))
    })

    test('uses a positive duration', () => {
      fadeLeave(el, done)

      const opts = mockTo.mock.calls[0][1]
      expect(opts.duration).toBeGreaterThan(0)
    })

    test('calls done via onComplete', () => {
      fadeLeave(el, done)

      const opts = mockTo.mock.calls[0][1]
      expect(opts.onComplete).toBe(done)
    })

    test('does not call gsap.fromTo', () => {
      fadeLeave(el, done)

      expect(mockFromTo).not.toHaveBeenCalled()
    })
  })

  test('fadeEnter and fadeLeave share the same duration', () => {
    fadeEnter(el, done)
    fadeLeave(el, done)

    expect(mockFromTo.mock.calls[0][2].duration).toBe(mockTo.mock.calls[0][1].duration)
  })
})

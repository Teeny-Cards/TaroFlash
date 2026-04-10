import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockFromTo, mockTo } = vi.hoisted(() => ({
  mockFromTo: vi.fn(),
  mockTo: vi.fn()
}))

vi.mock('gsap', () => ({ gsap: { fromTo: mockFromTo, to: mockTo } }))

import {
  slideUpFadeIn,
  slideDownFadeOut,
  slideUpFromEdge,
  slideDownToEdge,
  springScaleIn,
  scaleFadeOut
} from '@/utils/animations/modal'

// ── Helpers ───────────────────────────────────────────────────────────────────

const el = document.createElement('div')
const done = vi.fn()

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('modal animations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('slideUpFadeIn', () => {
    test('slides in from 200px below with fade', () => {
      slideUpFadeIn(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        { translateY: '200px', opacity: 0 },
        expect.objectContaining({ translateY: 0, opacity: 1 })
      )
    })

    test('calls done via onComplete', () => {
      slideUpFadeIn(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        expect.anything(),
        expect.objectContaining({ onComplete: done })
      )
    })
  })

  describe('slideDownFadeOut', () => {
    test('slides out 200px downward with fade', () => {
      slideDownFadeOut(el, done)

      expect(mockTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ translateY: '200px', opacity: 0 })
      )
    })

    test('calls done via onComplete', () => {
      slideDownFadeOut(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('slideUpFromEdge', () => {
    test('slides in from 100% (full-height edge)', () => {
      slideUpFromEdge(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        { translateY: '100%' },
        expect.objectContaining({ translateY: 0 })
      )
    })

    test('calls done via onComplete', () => {
      slideUpFromEdge(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        expect.anything(),
        expect.objectContaining({ onComplete: done })
      )
    })
  })

  describe('slideDownToEdge', () => {
    test('slides out to 100% (full-height edge)', () => {
      slideDownToEdge(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ translateY: '100%' }))
    })

    test('calls done via onComplete', () => {
      slideDownToEdge(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('springScaleIn', () => {
    test('scales in from 0.8 with spring ease', () => {
      springScaleIn(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        { scale: 0.8, opacity: 0 },
        expect.objectContaining({ scale: 1, opacity: 1, ease: 'back.out(1.7)' })
      )
    })

    test('calls done via onComplete', () => {
      springScaleIn(el, done)

      expect(mockFromTo).toHaveBeenCalledWith(
        el,
        expect.anything(),
        expect.objectContaining({ onComplete: done })
      )
    })
  })

  describe('scaleFadeOut', () => {
    test('scales out to 0.8 with fade', () => {
      scaleFadeOut(el, done)

      expect(mockTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ scale: 0.8, opacity: 0 })
      )
    })

    test('calls done via onComplete', () => {
      scaleFadeOut(el, done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })
})

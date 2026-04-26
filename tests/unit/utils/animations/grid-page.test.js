import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { mockSet, mockTo } = vi.hoisted(() => ({
  mockSet: vi.fn(),
  mockTo: vi.fn()
}))

vi.mock('gsap', () => ({ gsap: { set: mockSet, to: mockTo } }))

import { slideInFromDirection, slideOutInDirection } from '@/utils/animations/grid-page'

const el = document.createElement('div')
const done = vi.fn()

describe('grid-page animations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('slideInFromDirection', () => {
    test('forward primes initial state with positive x offset and zero opacity', () => {
      slideInFromDirection(el, 'forward', done)

      const setCall = mockSet.mock.calls[0]
      expect(setCall[0]).toBe(el)
      expect(setCall[1].x).toBeGreaterThan(0)
      expect(setCall[1].opacity).toBe(0)
    })

    test('backward primes initial state with negative x offset and zero opacity', () => {
      slideInFromDirection(el, 'backward', done)

      const setCall = mockSet.mock.calls[0]
      expect(setCall[1].x).toBeLessThan(0)
      expect(setCall[1].opacity).toBe(0)
    })

    test('tweens to rest position with full opacity', () => {
      slideInFromDirection(el, 'forward', done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ x: 0, opacity: 1 }))
    })

    test('calls done via onComplete', () => {
      slideInFromDirection(el, 'forward', done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('slideOutInDirection', () => {
    test('forward exits with negative x offset (away from incoming)', () => {
      slideOutInDirection(el, 'forward', done)

      const toCall = mockTo.mock.calls[0]
      expect(toCall[1].x).toBeLessThan(0)
      expect(toCall[1].opacity).toBe(0)
    })

    test('backward exits with positive x offset (away from incoming)', () => {
      slideOutInDirection(el, 'backward', done)

      const toCall = mockTo.mock.calls[0]
      expect(toCall[1].x).toBeGreaterThan(0)
      expect(toCall[1].opacity).toBe(0)
    })

    test('does not prime with gsap.set (leave animation)', () => {
      slideOutInDirection(el, 'forward', done)

      expect(mockSet).not.toHaveBeenCalled()
    })

    test('calls done via onComplete', () => {
      slideOutInDirection(el, 'backward', done)

      expect(mockTo).toHaveBeenCalledWith(el, expect.objectContaining({ onComplete: done }))
    })
  })

  describe('symmetry between in and out', () => {
    test('forward in (+x→0) and forward out (0→-x) move the page leftward overall', () => {
      slideInFromDirection(el, 'forward', done)
      const inFrom = mockSet.mock.calls[0][1].x
      mockSet.mockClear()
      mockTo.mockClear()
      slideOutInDirection(el, 'forward', done)
      const outTo = mockTo.mock.calls[0][1].x
      expect(inFrom).toBeGreaterThan(0)
      expect(outTo).toBeLessThan(0)
    })

    test('backward in (-x→0) and backward out (0→+x) move the page rightward overall', () => {
      slideInFromDirection(el, 'backward', done)
      const inFrom = mockSet.mock.calls[0][1].x
      mockSet.mockClear()
      mockTo.mockClear()
      slideOutInDirection(el, 'backward', done)
      const outTo = mockTo.mock.calls[0][1].x
      expect(inFrom).toBeLessThan(0)
      expect(outTo).toBeGreaterThan(0)
    })
  })
})

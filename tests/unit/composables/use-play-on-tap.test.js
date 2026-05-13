import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'

const { coarseRef, mockUseMediaQuery, mockPlayButtonTap } = vi.hoisted(() => {
  const coarseRef = { value: true }
  return {
    coarseRef,
    mockUseMediaQuery: vi.fn(() => coarseRef),
    mockPlayButtonTap: vi.fn(() => Promise.resolve())
  }
})

vi.mock('@/composables/use-media-query', () => ({
  useMediaQuery: mockUseMediaQuery
}))

vi.mock('@/utils/animations/button-tap', () => ({
  BUTTON_TAP_DURATION: 0.1,
  playButtonTap: mockPlayButtonTap
}))

import { usePlayOnTap } from '@/composables/use-play-on-tap'

function makeEvent(target = document.createElement('div')) {
  const e = new MouseEvent('click', { bubbles: true, cancelable: true })
  Object.defineProperty(e, 'currentTarget', { value: target, configurable: true })
  vi.spyOn(e, 'stopImmediatePropagation')
  vi.spyOn(e, 'preventDefault')
  return e
}

describe('usePlayOnTap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    coarseRef.value = true
    mockPlayButtonTap.mockImplementation(() => Promise.resolve())
  })

  describe('coarse-only gating (default)', () => {
    test('returns playing ref initialized to false', () => {
      const { playing } = usePlayOnTap()
      expect(playing.value).toBe(false)
    })

    test('runs animation when pointer is coarse', async () => {
      const { interceptClick, playing } = usePlayOnTap()
      const onAfter = vi.fn()
      const e = makeEvent()

      await interceptClick(e, onAfter)

      expect(mockPlayButtonTap).toHaveBeenCalled()
      expect(onAfter).toHaveBeenCalledWith(e)
      expect(playing.value).toBe(false) // reset defaults true
    })

    test('skips intercept on pointer:fine and does not call onAfter', async () => {
      coarseRef.value = false
      const { interceptClick, playing } = usePlayOnTap()
      const onAfter = vi.fn()
      const e = makeEvent()

      await interceptClick(e, onAfter)

      expect(e.stopImmediatePropagation).not.toHaveBeenCalled()
      expect(e.preventDefault).not.toHaveBeenCalled()
      expect(mockPlayButtonTap).not.toHaveBeenCalled()
      expect(onAfter).not.toHaveBeenCalled()
      expect(playing.value).toBe(false)
    })
  })

  describe('activeOn: "always"', () => {
    test('runs on pointer:fine when activeOn=always', async () => {
      coarseRef.value = false
      const { interceptClick } = usePlayOnTap({ activeOn: 'always' })
      const onAfter = vi.fn()
      const e = makeEvent()

      await interceptClick(e, onAfter)

      expect(mockPlayButtonTap).toHaveBeenCalled()
      expect(onAfter).toHaveBeenCalled()
    })
  })

  describe('event handling', () => {
    test('stops propagation and prevents default before animation', async () => {
      const { interceptClick } = usePlayOnTap()
      const e = makeEvent()
      await interceptClick(e, vi.fn())

      expect(e.stopImmediatePropagation).toHaveBeenCalled()
      expect(e.preventDefault).toHaveBeenCalled()
    })

    test('sets playing=true during animation, before onAfter runs', async () => {
      let playingDuringTween
      mockPlayButtonTap.mockImplementation(() => {
        playingDuringTween = playing.value
        return Promise.resolve()
      })
      const { interceptClick, playing } = usePlayOnTap()
      await interceptClick(makeEvent(), vi.fn())
      expect(playingDuringTween).toBe(true)
    })
  })

  describe('re-entrancy', () => {
    test('is a no-op while already playing', async () => {
      let resolveTween
      mockPlayButtonTap.mockImplementation(() => new Promise((r) => (resolveTween = r)))
      const { interceptClick, playing } = usePlayOnTap()
      const onAfter = vi.fn()

      const first = interceptClick(makeEvent(), onAfter)
      await nextTick()
      expect(playing.value).toBe(true)

      await interceptClick(makeEvent(), onAfter)
      expect(mockPlayButtonTap).toHaveBeenCalledTimes(1)

      resolveTween()
      await first
      await flushPromises()
    })
  })

  describe('beforePlay hook', () => {
    test('fires before the animation, after stop/preventDefault', async () => {
      const beforePlay = vi.fn()
      mockPlayButtonTap.mockImplementation(() => {
        expect(beforePlay).toHaveBeenCalledTimes(1)
        return Promise.resolve()
      })
      const { interceptClick } = usePlayOnTap({ beforePlay })
      const e = makeEvent()
      await interceptClick(e, vi.fn())
      expect(beforePlay).toHaveBeenCalledWith(e)
    })

    test('is not called when intercept is skipped', async () => {
      coarseRef.value = false
      const beforePlay = vi.fn()
      const { interceptClick } = usePlayOnTap({ beforePlay })
      await interceptClick(makeEvent(), vi.fn())
      expect(beforePlay).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    test('resets playing to false after onAfter when reset=true (default)', async () => {
      const { interceptClick, playing } = usePlayOnTap()
      await interceptClick(makeEvent(), vi.fn())
      expect(playing.value).toBe(false)
    })

    test('holds playing=true after onAfter when reset=false', async () => {
      const { interceptClick, playing } = usePlayOnTap({ reset: false })
      await interceptClick(makeEvent(), vi.fn())
      expect(playing.value).toBe(true)
    })
  })

  describe('animate option', () => {
    test('uses GSAP when animate is true (default)', async () => {
      const { interceptClick } = usePlayOnTap()
      await interceptClick(makeEvent(), vi.fn())
      expect(mockPlayButtonTap).toHaveBeenCalled()
    })

    test('uses setTimeout-based hold when animate=false', async () => {
      vi.useFakeTimers()
      const { interceptClick, playing } = usePlayOnTap({ animate: false, duration: 0.25 })
      const onAfter = vi.fn()

      const p = interceptClick(makeEvent(), onAfter)
      await nextTick()
      expect(playing.value).toBe(true)
      expect(mockPlayButtonTap).not.toHaveBeenCalled()
      expect(onAfter).not.toHaveBeenCalled()

      vi.advanceTimersByTime(250)
      await p
      expect(onAfter).toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('duration option', () => {
    test('forwards duration to playButtonTap', async () => {
      const { interceptClick } = usePlayOnTap({ duration: 0.4 })
      await interceptClick(makeEvent(), vi.fn())
      expect(mockPlayButtonTap).toHaveBeenCalledWith(expect.any(HTMLElement), 0.4)
    })
  })
})

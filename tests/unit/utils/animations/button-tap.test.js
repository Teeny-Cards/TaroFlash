import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'

const { mockTo } = vi.hoisted(() => ({
  mockTo: vi.fn((_el, opts) => opts?.onComplete?.())
}))

vi.mock('gsap', () => ({ gsap: { to: mockTo } }))

import { BUTTON_TAP_DURATION, playButtonTap } from '@/utils/animations/button-tap'

const el = document.createElement('div')

describe('playButtonTap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  test('resolves the returned promise via onComplete', async () => {
    await expect(playButtonTap(el)).resolves.toBeUndefined()
  })

  test('uses power2.out easing', () => {
    playButtonTap(el)
    expect(mockTo.mock.calls[0][1].ease).toBe('power2.out')
  })

  test('BUTTON_TAP_DURATION is a positive number', () => {
    expect(BUTTON_TAP_DURATION).toBeGreaterThan(0)
  })
})

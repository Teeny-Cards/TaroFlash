import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const gsapMock = vi.hoisted(() => ({
  set: vi.fn(),
  to: vi.fn((_el, opts) => {
    opts?.onStart?.()
    opts?.onComplete?.()
  })
}))

vi.mock('gsap', () => ({ gsap: gsapMock }))

const { actionItemEnter, actionItemLeave } = await import('@/utils/animations/action-menu')

describe('actionItemEnter', () => {
  beforeEach(() => {
    gsapMock.set.mockClear()
    gsapMock.to.mockClear()
  })

  test('sets initial scale/opacity then tweens to full', () => {
    const el = document.createElement('div')
    const done = vi.fn()
    actionItemEnter(el, 0, { stagger: 0.05, duration: 0.2 }, done)

    expect(gsapMock.set).toHaveBeenCalledWith(el, { scale: 0.6, opacity: 0 })
    expect(gsapMock.to).toHaveBeenCalledWith(
      el,
      expect.objectContaining({ scale: 1, opacity: 1, duration: 0.2 })
    )
  })

  test('delay scales linearly with index', () => {
    const el = document.createElement('div')
    actionItemEnter(el, 3, { stagger: 0.05, duration: 0.2 }, vi.fn())
    const opts = gsapMock.to.mock.calls[0][1]
    expect(opts.delay).toBeCloseTo(0.15)
  })

  test('forwards onStart and resolves done via gsap onComplete', () => {
    const el = document.createElement('div')
    const onStart = vi.fn()
    const done = vi.fn()
    actionItemEnter(el, 1, { stagger: 0.1, duration: 0.2, onStart }, done)
    expect(onStart).toHaveBeenCalledTimes(1)
    expect(done).toHaveBeenCalledTimes(1)
  })
})

describe('actionItemLeave', () => {
  beforeEach(() => {
    gsapMock.set.mockClear()
    gsapMock.to.mockClear()
  })

  test('tweens to scale 0.6 / opacity 0', () => {
    const el = document.createElement('div')
    actionItemLeave(el, 0, { stagger: 0.05, duration: 0.2 }, vi.fn())
    expect(gsapMock.to).toHaveBeenCalledWith(
      el,
      expect.objectContaining({ scale: 0.6, opacity: 0, duration: 0.2 })
    )
  })

  test('forwards onStart and resolves done', () => {
    const el = document.createElement('div')
    const onStart = vi.fn()
    const done = vi.fn()
    actionItemLeave(el, 2, { stagger: 0.1, duration: 0.2, onStart }, done)
    expect(onStart).toHaveBeenCalledTimes(1)
    expect(done).toHaveBeenCalledTimes(1)
  })
})

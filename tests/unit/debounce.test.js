import { describe, test, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('calls the function after the delay', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const promise = debounce(fn, { delay: 300 })

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    const result = await promise

    expect(fn).toHaveBeenCalledOnce()
    expect(result).toBe('result')
  })

  test('cancels previous call when called again before delay', async () => {
    const fn = vi.fn().mockResolvedValue('result')

    const first = debounce(fn, { delay: 300 })
    vi.advanceTimersByTime(100)
    const second = debounce(fn, { delay: 300 })

    vi.advanceTimersByTime(300)
    const [firstResult, secondResult] = await Promise.all([first, second])

    expect(fn).toHaveBeenCalledOnce()
    expect(firstResult).toBeUndefined()
    expect(secondResult).toBe('result')
  })

  test('key-based debounce deduplicates across different function references', async () => {
    const fn1 = vi.fn().mockResolvedValue('one')
    const fn2 = vi.fn().mockResolvedValue('two')

    const first = debounce(fn1, { key: 'shared', delay: 300 })
    vi.advanceTimersByTime(100)
    const second = debounce(fn2, { key: 'shared', delay: 300 })

    vi.advanceTimersByTime(300)
    const [firstResult, secondResult] = await Promise.all([first, second])

    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledOnce()
    expect(firstResult).toBeUndefined()
    expect(secondResult).toBe('two')
  })

  test('uses default delay of 300ms', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const promise = debounce(fn)

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    await promise

    expect(fn).toHaveBeenCalledOnce()
  })

  test('rejects if the callback throws', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'))
    const promise = debounce(fn, { delay: 100 })

    vi.advanceTimersByTime(100)

    await expect(promise).rejects.toThrow('boom')
  })

  test('independent keys do not cancel each other', async () => {
    const fn1 = vi.fn().mockResolvedValue('a')
    const fn2 = vi.fn().mockResolvedValue('b')

    const p1 = debounce(fn1, { key: 'key-a', delay: 200 })
    const p2 = debounce(fn2, { key: 'key-b', delay: 200 })

    vi.advanceTimersByTime(200)
    const [r1, r2] = await Promise.all([p1, p2])

    expect(r1).toBe('a')
    expect(r2).toBe('b')
  })
})

import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

function createMockMql(matches = false) {
  const handlers = new Set()
  return {
    matches,
    addEventListener: vi.fn((_, cb) => handlers.add(cb)),
    removeEventListener: vi.fn((_, cb) => handlers.delete(cb)),
    _fire() {
      handlers.forEach((cb) => cb())
    }
  }
}

function withSetup(composable) {
  let result
  const Wrapper = defineComponent({
    setup() {
      result = composable()
      return () => null
    }
  })
  const wrapper = mount(Wrapper)
  return [result, wrapper]
}

describe('useMediaQuery', () => {
  let mockMql
  let useMediaQuery

  beforeEach(async () => {
    // Reset module cache so the internal `cache` Map starts fresh each test
    vi.resetModules()
    mockMql = createMockMql(false)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)
    ;({ useMediaQuery } = await import('@/composables/use-media-query'))
  })

  test('returns false initially when matchMedia does not match', async () => {
    mockMql.matches = false
    const [result, wrapper] = withSetup(() => useMediaQuery('dark'))
    await nextTick()
    expect(result.value).toBe(false)
    wrapper.unmount()
  })

  test('syncs ref to matchMedia.matches on mount', async () => {
    mockMql.matches = true
    const [result, wrapper] = withSetup(() => useMediaQuery('dark'))
    await nextTick()
    expect(result.value).toBe(true)
    wrapper.unmount()
  })

  test('maps coarse pointer key to (pointer: coarse)', () => {
    const [, w] = withSetup(() => useMediaQuery('coarse'))
    expect(window.matchMedia).toHaveBeenCalledWith('(pointer: coarse)')
    w.unmount()
  })

  test('maps fine pointer key to (pointer: fine)', () => {
    const [, w] = withSetup(() => useMediaQuery('fine'))
    expect(window.matchMedia).toHaveBeenCalledWith('(pointer: fine)')
    w.unmount()
  })

  test('maps light key to (prefers-color-scheme: light)', () => {
    const [, w] = withSetup(() => useMediaQuery('light'))
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: light)')
    w.unmount()
  })

  test('maps dark key to (prefers-color-scheme: dark)', () => {
    const [, w] = withSetup(() => useMediaQuery('dark'))
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    w.unmount()
  })

  test('maps breakpoint key to (min-width: ...) query', () => {
    const [, w] = withSetup(() => useMediaQuery('sm'))
    expect(window.matchMedia).toHaveBeenCalledWith(expect.stringMatching(/^\(min-width:/))
    w.unmount()
  })

  test('caches entry — matchMedia not called again for same query', () => {
    const [, w1] = withSetup(() => useMediaQuery('dark'))
    const [, w2] = withSetup(() => useMediaQuery('dark'))
    expect(window.matchMedia).toHaveBeenCalledTimes(1)
    w1.unmount()
    w2.unmount()
  })

  test('returns the same ref for the same query', () => {
    const [ref1, w1] = withSetup(() => useMediaQuery('dark'))
    const [ref2, w2] = withSetup(() => useMediaQuery('dark'))
    expect(ref1).toBe(ref2)
    w1.unmount()
    w2.unmount()
  })

  test('updates ref value when media query change fires', async () => {
    const [result, wrapper] = withSetup(() => useMediaQuery('dark'))
    await nextTick()
    mockMql.matches = true
    mockMql._fire()
    expect(result.value).toBe(true)
    wrapper.unmount()
  })

  test('does not remove listener on unmount — cache is app-lifetime', async () => {
    const [, wrapper] = withSetup(() => useMediaQuery('dark'))
    await nextTick()
    wrapper.unmount()
    expect(mockMql.removeEventListener).not.toHaveBeenCalled()
  })

  test('different queries create separate cache entries', () => {
    const mockMql2 = createMockMql(true)
    window.matchMedia.mockReturnValueOnce(mockMql).mockReturnValueOnce(mockMql2)
    const [ref1, w1] = withSetup(() => useMediaQuery('dark'))
    const [ref2, w2] = withSetup(() => useMediaQuery('light'))
    expect(ref1).not.toBe(ref2)
    w1.unmount()
    w2.unmount()
  })
})

describe('useMobileBreakpoint', () => {
  let widthMql
  let heightMql
  let useMobileBreakpoint

  beforeEach(async () => {
    vi.resetModules()
    widthMql = createMockMql(false)
    heightMql = createMockMql(false)

    window.matchMedia = vi.fn((query) => {
      if (query.includes('min-width')) return widthMql
      if (query.includes('min-height')) return heightMql
      return createMockMql(false)
    })
    ;({ useMobileBreakpoint } = await import('@/composables/use-media-query'))
  })

  test('queries both width and height against the same breakpoint token', () => {
    const [, w] = withSetup(() => useMobileBreakpoint('sm'))

    const queries = window.matchMedia.mock.calls.map((c) => c[0])
    expect(queries.some((q) => q.includes('min-width'))).toBe(true)
    expect(queries.some((q) => q.includes('min-height'))).toBe(true)
    w.unmount()
  })

  test('returns false when both width and height match are false', async () => {
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()
    expect(result.value).toBe(false)
    w.unmount()
  })

  test('returns true when only width is below threshold', async () => {
    widthMql.matches = true
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()
    expect(result.value).toBe(true)
    w.unmount()
  })

  test('returns true when only height is below threshold', async () => {
    heightMql.matches = true
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()
    expect(result.value).toBe(true)
    w.unmount()
  })

  test('returns true when both are below threshold', async () => {
    widthMql.matches = true
    heightMql.matches = true
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()
    expect(result.value).toBe(true)
    w.unmount()
  })

  test('reacts when width crosses the threshold', async () => {
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()
    expect(result.value).toBe(false)

    widthMql.matches = true
    widthMql._fire()
    await nextTick()
    expect(result.value).toBe(true)
    w.unmount()
  })

  test('reacts when height crosses the threshold', async () => {
    const [result, w] = withSetup(() => useMobileBreakpoint('sm'))
    await nextTick()

    heightMql.matches = true
    heightMql._fire()
    await nextTick()
    expect(result.value).toBe(true)
    w.unmount()
  })

  test('width and height axes are queried separately', () => {
    const [, w] = withSetup(() => useMobileBreakpoint('md', 'lg'))

    const queries = window.matchMedia.mock.calls.map((c) => c[0])
    expect(queries.some((q) => q.includes('min-width'))).toBe(true)
    expect(queries.some((q) => q.includes('min-height'))).toBe(true)
    w.unmount()
  })

  test('defaults both width and height to "sm"', () => {
    const [, w] = withSetup(() => useMobileBreakpoint())

    const queries = window.matchMedia.mock.calls.map((c) => c[0])
    const widthQuery = queries.find((q) => q.includes('min-width'))
    const heightQuery = queries.find((q) => q.includes('min-height'))

    const widthValue = widthQuery.match(/min-width:\s*([^)]*)\)/)?.[1]
    const heightValue = heightQuery.match(/min-height:\s*([^)]*)\)/)?.[1]
    expect(widthValue).toBe(heightValue)
    w.unmount()
  })
})

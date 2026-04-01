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

  test('removes event listener when the last consumer unmounts', async () => {
    const [, wrapper] = withSetup(() => useMediaQuery('dark'))
    await nextTick()
    wrapper.unmount()
    expect(mockMql.removeEventListener).toHaveBeenCalled()
  })

  test('does not remove listener when one of two consumers unmounts', async () => {
    const [, w1] = withSetup(() => useMediaQuery('dark'))
    const [, w2] = withSetup(() => useMediaQuery('dark'))
    w1.unmount()
    expect(mockMql.removeEventListener).not.toHaveBeenCalled()
    w2.unmount()
    expect(mockMql.removeEventListener).toHaveBeenCalled()
  })

  test('re-registers matchMedia after all consumers unmount', async () => {
    const [, w1] = withSetup(() => useMediaQuery('dark'))
    w1.unmount()
    window.matchMedia.mockClear()
    const [, w2] = withSetup(() => useMediaQuery('dark'))
    expect(window.matchMedia).toHaveBeenCalledTimes(1)
    w2.unmount()
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

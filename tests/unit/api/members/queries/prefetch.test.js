import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { ensureSpy, fetchSpy, fetchMemberByIdMock } = vi.hoisted(() => ({
  ensureSpy: vi.fn(),
  fetchSpy: vi.fn(),
  fetchMemberByIdMock: vi.fn()
}))

vi.mock('@pinia/colada', () => ({
  useQueryCache: () => ({
    ensure: ensureSpy,
    fetch: fetchSpy
  })
}))

vi.mock('@/api/members/db', () => ({
  fetchMemberById: fetchMemberByIdMock
}))

import { prefetchMemberById } from '@/api/members/queries/prefetch'

beforeEach(() => {
  ensureSpy.mockReset()
  fetchSpy.mockReset()
  fetchMemberByIdMock.mockReset()
})

describe('prefetchMemberById', () => {
  test('scopes the cache key by id so the entry matches useCurrentMemberQuery for the same user', () => {
    ensureSpy.mockReturnValue({})
    fetchSpy.mockResolvedValue({})

    prefetchMemberById('user-1')

    const [opts] = ensureSpy.mock.calls[0]
    expect(opts.key).toEqual(['member', 'user-1'])
  })

  test('query closure forwards the id to fetchMemberById at call time', async () => {
    ensureSpy.mockReturnValue({})
    fetchSpy.mockResolvedValue({})
    fetchMemberByIdMock.mockResolvedValue({ id: 'user-1' })

    prefetchMemberById('user-1')

    const [opts] = ensureSpy.mock.calls[0]
    await opts.query()
    expect(fetchMemberByIdMock).toHaveBeenCalledWith('user-1')
  })

  test('kicks a fetch against the ensured entry so the request starts before any view mounts', () => {
    const entry = { id: 'entry' }
    ensureSpy.mockReturnValue(entry)
    fetchSpy.mockResolvedValue({})

    prefetchMemberById('user-1')

    expect(fetchSpy).toHaveBeenCalledWith(entry)
  })

  test('returns the fetch promise so callers can await it when needed', async () => {
    const data = { id: 'user-1', display_name: 'A' }
    ensureSpy.mockReturnValue({})
    fetchSpy.mockResolvedValue(data)

    await expect(prefetchMemberById('user-1')).resolves.toBe(data)
  })
})

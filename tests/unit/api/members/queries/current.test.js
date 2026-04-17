import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useQuerySpy, fetchMemberByIdMock, sessionUser } = vi.hoisted(() => ({
  useQuerySpy: vi.fn((cfg) => cfg),
  fetchMemberByIdMock: vi.fn(),
  sessionUser: { value: null }
}))

vi.mock('@pinia/colada', () => ({
  useQuery: useQuerySpy
}))

vi.mock('@/api/members/db', () => ({
  fetchMemberById: fetchMemberByIdMock
}))

vi.mock('@/stores/session', () => ({
  useSessionStore: () => ({
    get user() {
      return sessionUser.value
    }
  })
}))

import { useCurrentMemberQuery } from '@/api/members/queries/current'

beforeEach(() => {
  useQuerySpy.mockClear()
  fetchMemberByIdMock.mockReset()
  sessionUser.value = null
})

function configFrom() {
  useCurrentMemberQuery()
  return useQuerySpy.mock.calls.at(-1)[0]
}

describe('useCurrentMemberQuery', () => {
  test('key is scoped by session user id so the cache is per-user (prevents stale data across logins)', () => {
    sessionUser.value = { id: 'user-1' }
    const { key } = configFrom()
    expect(key()).toEqual(['member', 'user-1'])
  })

  test('key falls back to an empty string when there is no user (keeps key JSON-serializable)', () => {
    sessionUser.value = null
    const { key } = configFrom()
    expect(key()).toEqual(['member', ''])
  })

  test('enabled is false pre-auth — prevents the query from firing with a missing user id', () => {
    sessionUser.value = null
    const { enabled } = configFrom()
    expect(enabled()).toBe(false)
  })

  test('enabled becomes true as soon as session.user.id is set', () => {
    const { enabled } = configFrom()
    expect(enabled()).toBe(false)
    sessionUser.value = { id: 'user-1' }
    expect(enabled()).toBe(true)
  })

  test('query fetches by the current session user id', async () => {
    sessionUser.value = { id: 'user-1' }
    fetchMemberByIdMock.mockResolvedValue({ id: 'user-1', display_name: 'A' })

    const { query } = configFrom()
    const result = await query()

    expect(fetchMemberByIdMock).toHaveBeenCalledWith('user-1')
    expect(result).toEqual({ id: 'user-1', display_name: 'A' })
  })

  test('query returns null (not undefined) when user is absent — keeps the cache value stable', async () => {
    sessionUser.value = null
    const { query } = configFrom()
    const result = await query()
    expect(result).toBeNull()
    expect(fetchMemberByIdMock).not.toHaveBeenCalled()
  })
})

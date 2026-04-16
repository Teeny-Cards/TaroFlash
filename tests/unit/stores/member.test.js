import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/members', () => ({
  fetchMemberById: vi.fn()
}))

import { useMemberStore } from '@/stores/member'
import { fetchMemberById } from '@/api/members'

describe('useMemberStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchMemberById).mockReset()
  })

  test('initializes with all fields undefined and has_member false', () => {
    const store = useMemberStore()
    expect(store.id).toBeUndefined()
    expect(store.display_name).toBeUndefined()
    expect(store.email).toBeUndefined()
    expect(store.role).toBeUndefined()
    expect(store.plan).toBeUndefined()
    expect(store.has_member).toBe(false)
  })

  test('has_member is true once an id is set', () => {
    const store = useMemberStore()
    store.id = 'abc'
    expect(store.has_member).toBe(true)
  })

  test('fetchMember hydrates every field from the api result', async () => {
    vi.mocked(fetchMemberById).mockResolvedValue({
      id: 'user-1',
      display_name: 'Alice',
      description: 'hi',
      email: 'a@test.com',
      created_at: '2026-01-01',
      avatar_url: 'https://avatar',
      updated_at: '2026-01-02',
      role: 'admin',
      plan: 'paid'
    })

    const store = useMemberStore()
    await store.fetchMember('user-1')

    expect(fetchMemberById).toHaveBeenCalledWith('user-1')
    expect(store.id).toBe('user-1')
    expect(store.display_name).toBe('Alice')
    expect(store.description).toBe('hi')
    expect(store.email).toBe('a@test.com')
    expect(store.created_at).toBe('2026-01-01')
    expect(store.avatar_url).toBe('https://avatar')
    expect(store.updated_at).toBe('2026-01-02')
    expect(store.role).toBe('admin')
    expect(store.plan).toBe('paid')
    expect(store.has_member).toBe(true)
  })

  test('fetchMember leaves store untouched when api returns null', async () => {
    vi.mocked(fetchMemberById).mockResolvedValue(null)

    const store = useMemberStore()
    await store.fetchMember('user-1')

    expect(store.id).toBeUndefined()
    expect(store.role).toBeUndefined()
    expect(store.plan).toBeUndefined()
    expect(store.has_member).toBe(false)
  })
})

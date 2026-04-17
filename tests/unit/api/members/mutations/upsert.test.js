import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, invalidateSpy, upsertMemberMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  invalidateSpy: vi.fn(),
  upsertMemberMock: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@pinia/colada', () => ({
  useMutation: useMutationSpy,
  useQueryCache: () => ({ invalidateQueries: invalidateSpy })
}))

vi.mock('@/api/members/db', () => ({ upsertMember: upsertMemberMock }))

import { useUpsertMemberMutation } from '@/api/members/mutations/upsert'

beforeEach(() => {
  useMutationSpy.mockClear()
  invalidateSpy.mockClear()
  upsertMemberMock.mockClear()
})

function configFrom() {
  useUpsertMemberMutation()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useUpsertMemberMutation', () => {
  test('mutation delegates to upsertMember', async () => {
    const { mutation } = configFrom()
    await mutation({ id: 'user-1', display_name: 'Alice' })
    expect(upsertMemberMock).toHaveBeenCalledWith({ id: 'user-1', display_name: 'Alice' })
  })

  test('onSettled invalidates ["member", id] — current-user cache refreshes after profile change', () => {
    const { onSettled } = configFrom()
    onSettled(undefined, undefined, { id: 'user-1', display_name: 'Alice' })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['member', 'user-1'] })
  })

  test('falls back to empty string id when member.id is missing (keeps the key JSON-serializable)', () => {
    const { onSettled } = configFrom()
    onSettled(undefined, undefined, { display_name: 'No-id' })
    expect(invalidateSpy).toHaveBeenCalledWith({ key: ['member', ''] })
  })
})

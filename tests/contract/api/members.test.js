import { describe, test, expect, beforeEach, afterEach } from 'vite-plus/test'
import { signInAsTestUser } from '../setup.js'
import { setMemberDisplayName } from '../fixtures.js'
import { fetchMemberById, upsertMember } from '@/api/members/db'

let session

beforeEach(async () => {
  session = await signInAsTestUser()
})

afterEach(async () => {
  await session?.cleanup()
  session = null
})

describe('fetchMemberById (contract)', () => {
  test('returns the member row for the current user', async () => {
    const display_name = await setMemberDisplayName(session.client, session.userId)
    const member = await fetchMemberById(session.userId)
    expect(member).toMatchObject({ id: session.userId, display_name })
  })

  test('returns null when the member is not visible (RLS)', async () => {
    const member = await fetchMemberById('00000000-0000-0000-0000-000000000000')
    expect(member).toBeNull()
  })
})

describe('upsertMember (contract)', () => {
  test('updates fields on the current member', async () => {
    const display_name = `Renamed ${session.userId.slice(0, 6)}`
    await upsertMember({ id: session.userId, display_name })
    const member = await fetchMemberById(session.userId)
    expect(member?.display_name).toBe(display_name)
  })
})

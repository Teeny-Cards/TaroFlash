import { assertEquals } from '@std/assert'
import { makeFakeSupabase, noSleep } from '../_shared/test-utils.ts'
import { handler } from './index.ts'

type MediaRow = { id: number; bucket: string; path: string; member_id: string }

Deno.test('returns 200 with no-rows message when nothing to clean', async () => {
  const { supabase, calls } = makeFakeSupabase({ rows: [] })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 200)
  assertEquals(await res.json(), { message: 'No media to clean' })
  assertEquals(calls.removed.length, 0)
  assertEquals(calls.deletedIds.length, 0)
})

Deno.test('returns 500 on select error', async () => {
  const { supabase } = makeFakeSupabase({ selectError: { message: 'boom' } })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 500)
  assertEquals(await res.json(), { error: 'select_failed' })
})

Deno.test('groups by bucket+member, removes storage, deletes rows', async () => {
  const rows: MediaRow[] = [
    { id: 1, bucket: 'cards', path: 'a.png', member_id: 'm1' },
    { id: 2, bucket: 'cards', path: 'b.png', member_id: 'm1' },
    { id: 3, bucket: 'cards', path: 'c.png', member_id: 'm2' },
    { id: 4, bucket: 'avatars', path: 'd.png', member_id: 'm1' }
  ]
  const { supabase, calls } = makeFakeSupabase({ rows })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 200)
  assertEquals(await res.json(), { message: 'Media cleanup complete', processed: 4, skipped: 0 })

  assertEquals(calls.removed.length, 3)
  const cardsM1 = calls.removed.find((r) => r.bucket === 'cards' && r.paths[0].startsWith('m1/'))
  assertEquals(cardsM1?.paths, ['m1/a.png', 'm1/b.png'])
  const cardsM2 = calls.removed.find((r) => r.bucket === 'cards' && r.paths[0].startsWith('m2/'))
  assertEquals(cardsM2?.paths, ['m2/c.png'])
  const avatars = calls.removed.find((r) => r.bucket === 'avatars')
  assertEquals(avatars?.paths, ['m1/d.png'])

  assertEquals(calls.deletedIds.length, 1)
  assertEquals(
    [...calls.deletedIds[0]].sort((a, b) => a - b),
    [1, 2, 3, 4]
  )
})

Deno.test('skipped group does not block others, returns 207', async () => {
  const rows: MediaRow[] = [
    { id: 1, bucket: 'cards', path: 'a.png', member_id: 'm1' },
    { id: 2, bucket: 'avatars', path: 'b.png', member_id: 'm1' }
  ]
  const removeErrors = new Map([
    ['cards', [{ message: 'fail' }, { message: 'fail' }, { message: 'fail' }]]
  ])
  const { supabase, calls } = makeFakeSupabase({ rows, removeErrors })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 207)
  const body = await res.json()
  assertEquals(body.processed, 1)
  assertEquals(body.skipped, 1)
  assertEquals(body.storage_errors.length, 1)

  assertEquals(calls.deletedIds, [[2]])
})

Deno.test('retries transient storage failures before succeeding', async () => {
  const rows: MediaRow[] = [{ id: 1, bucket: 'cards', path: 'a.png', member_id: 'm1' }]
  const removeErrors = new Map([['cards', [{ message: 'transient' }, { message: 'transient' }]]])
  const { supabase, calls } = makeFakeSupabase({ rows, removeErrors })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 200)
  assertEquals(calls.removed.length, 3)
  assertEquals(calls.deletedIds, [[1]])
})

Deno.test('returns 500 when DB delete fails after storage success', async () => {
  const rows: MediaRow[] = [{ id: 1, bucket: 'cards', path: 'a.png', member_id: 'm1' }]
  const { supabase } = makeFakeSupabase({ rows, deleteError: { message: 'db down' } })

  const res = await handler({ supabase, sleep: noSleep })

  assertEquals(res.status, 500)
  const body = await res.json()
  assertEquals(body.error, 'delete_failed')
})

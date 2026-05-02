// supabase/functions/cleanup-media/index.ts
import { createClient } from '@supabase/supabase-js'

const BATCH_SIZE = 500

type MediaRow = { id: number; bucket: string; path: string; member_id: string }
type Group = { bucket: string; memberId: string; paths: string[]; ids: number[] }

export type Sleep = (ms: number) => Promise<void>
export type SupabaseLike = {
  from: (table: string) => any
  storage: { from: (bucket: string) => { remove: (paths: string[]) => Promise<{ error: any }> } }
}

export type Deps = {
  supabase: SupabaseLike
  sleep?: Sleep
  retryAttempts?: number
}

async function withRetry<T>(fn: () => Promise<T>, attempts: number, sleep: Sleep): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) await sleep(500 * Math.pow(2, i))
    }
  }

  throw lastError
}

function groupByBucketAndMember(rows: MediaRow[]): Group[] {
  const groups = new Map<string, Group>()

  for (const row of rows) {
    const key = `${row.bucket}::${row.member_id}`
    if (!groups.has(key)) {
      groups.set(key, { bucket: row.bucket, memberId: row.member_id, paths: [], ids: [] })
    }
    const g = groups.get(key)!
    g.paths.push(row.path)
    g.ids.push(row.id)
  }

  return [...groups.values()]
}

async function removeGroupFromStorage(
  supabase: SupabaseLike,
  group: Group,
  attempts: number,
  sleep: Sleep
): Promise<{ ids: number[]; error: string | null }> {
  const fullPaths = group.paths.map((p) => `${group.memberId}/${p}`)

  try {
    await withRetry(
      () =>
        supabase.storage
          .from(group.bucket)
          .remove(fullPaths)
          .then(({ error }) => {
            if (error) throw error
          }),
      attempts,
      sleep
    )
    return { ids: group.ids, error: null }
  } catch (err: any) {
    return {
      ids: [],
      error: `bucket=${group.bucket} member=${group.memberId}: ${err?.message ?? err}`
    }
  }
}

export async function handler({ supabase, sleep, retryAttempts = 3 }: Deps): Promise<Response> {
  const wait = sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)))

  const { data: mediaRows, error: selectError } = await supabase
    .from('media')
    .select('id, bucket, path, member_id')
    .not('deleted_at', 'is', null)
    .limit(BATCH_SIZE)

  if (selectError) {
    console.error('Error selecting media:', selectError)
    return new Response(JSON.stringify({ error: 'select_failed' }), { status: 500 })
  }

  if (!mediaRows || mediaRows.length === 0) {
    return new Response(JSON.stringify({ message: 'No media to clean' }), { status: 200 })
  }

  const groups = groupByBucketAndMember(mediaRows)

  const successfulIds: number[] = []
  const storageErrors: string[] = []

  for (const group of groups) {
    const { ids, error } = await removeGroupFromStorage(supabase, group, retryAttempts, wait)
    if (error) {
      console.error('Storage delete failed after retries:', error)
      storageErrors.push(error)
      continue
    }
    successfulIds.push(...ids)
  }

  if (successfulIds.length > 0) {
    const { error: deleteError } = await supabase.from('media').delete().in('id', successfulIds)

    if (deleteError) {
      console.error('Error deleting media rows:', deleteError)
      return new Response(
        JSON.stringify({ error: 'delete_failed', storage_errors: storageErrors }),
        { status: 500 }
      )
    }
  }

  const status = storageErrors.length > 0 ? 207 : 200
  return new Response(
    JSON.stringify({
      message: 'Media cleanup complete',
      processed: successfulIds.length,
      skipped: mediaRows.length - successfulIds.length,
      ...(storageErrors.length > 0 && { storage_errors: storageErrors })
    }),
    { status }
  )
}

if (import.meta.main) {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  Deno.serve(() => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })
    return handler({ supabase })
  })
}

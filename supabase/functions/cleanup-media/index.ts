// supabase/functions/cleanup-media/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BATCH_SIZE = 500

// Retry a fallible async operation up to `attempts` times with exponential backoff.
// Delays: 500ms, 1000ms, 2000ms (capped at 3 attempts by default).
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)))
      }
    }
  }
  throw lastError
}

serve(async (_req: any) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  })

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

  // Group paths by (bucket, member_id) so we build the correct storage path
  // for each member. Storage paths are scoped under the member's folder:
  // {member_id}/{path}
  type GroupKey = string // `${bucket}::${member_id}`
  const groups = new Map<
    GroupKey,
    { bucket: string; memberId: string; paths: string[]; ids: number[] }
  >()

  for (const row of mediaRows) {
    const key: GroupKey = `${row.bucket}::${row.member_id}`
    if (!groups.has(key)) {
      groups.set(key, { bucket: row.bucket, memberId: row.member_id, paths: [], ids: [] })
    }
    const g = groups.get(key)!
    g.paths.push(row.path)
    g.ids.push(row.id)
  }

  // Track which media IDs were successfully removed from storage so we only
  // delete DB records for those. If storage removal fails for a group (even
  // after retries) we skip its IDs — the next invocation will retry them.
  const successfulIds: number[] = []
  const storageErrors: string[] = []

  for (const { bucket, memberId, paths, ids } of groups.values()) {
    const fullPaths = paths.map((p) => `${memberId}/${p}`)

    try {
      await withRetry(() =>
        supabase.storage
          .from(bucket)
          .remove(fullPaths)
          .then(({ error }) => {
            if (error) throw error
          })
      )
      successfulIds.push(...ids)
    } catch (err: any) {
      const msg = `bucket=${bucket} member=${memberId}: ${err?.message ?? err}`
      console.error('Storage delete failed after retries:', msg)
      storageErrors.push(msg)
      // Continue to the next group — don't let one failure block the rest.
    }
  }

  // Delete DB records only for files that were confirmed removed from storage.
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

  const status = storageErrors.length > 0 ? 207 : 200 // 207 = partial success
  return new Response(
    JSON.stringify({
      message: 'Media cleanup complete',
      processed: successfulIds.length,
      skipped: mediaRows.length - successfulIds.length,
      ...(storageErrors.length > 0 && { storage_errors: storageErrors })
    }),
    { status }
  )
})

// supabase/functions/cleanup-media/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BATCH_SIZE = 500

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
  // for each member. The old code used mediaRows[0].member_id for all rows,
  // which would delete files from the wrong folder when a batch contained
  // media belonging to different members.
  type GroupKey = string // `${bucket}::${member_id}`
  const groups = new Map<GroupKey, { bucket: string; memberId: string; paths: string[] }>()

  for (const row of mediaRows) {
    const key: GroupKey = `${row.bucket}::${row.member_id}`
    if (!groups.has(key)) {
      groups.set(key, { bucket: row.bucket, memberId: row.member_id, paths: [] })
    }
    groups.get(key)!.paths.push(row.path)
  }

  for (const { bucket, memberId, paths } of groups.values()) {
    // Storage paths are scoped under the member's folder: {member_id}/{path}
    const fullPaths = paths.map((p) => `${memberId}/${p}`)
    const { error } = await supabase.storage.from(bucket).remove(fullPaths)

    if (error) {
      console.error(`Error removing from bucket ${bucket}:`, error)
      return new Response(JSON.stringify({ error: 'storage_delete_failed', bucket }), {
        status: 500
      })
    }
  }

  const ids = mediaRows.map((m) => m.id)
  const { error: deleteError } = await supabase.from('media').delete().in('id', ids)

  if (deleteError) {
    console.error('Error deleting media rows:', deleteError)
    return new Response(JSON.stringify({ error: 'delete_failed' }), { status: 500 })
  }

  return new Response(
    JSON.stringify({ message: 'Media cleanup complete', processed: mediaRows.length }),
    { status: 200 }
  )
})

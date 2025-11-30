// supabase/functions/cleanup-media/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SERVER_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!
const BATCH_SIZE = 500

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  })

  const { data: mediaRows, error: selectError } = await supabase
    .from('media')
    .select('id, bucket, path')
    .not('deleted_at', 'is', null)
    .limit(BATCH_SIZE)

  if (selectError) {
    console.error('Error selecting media:', selectError)
    return new Response(JSON.stringify({ error: 'select_failed' }), {
      status: 500,
      headers: corsHeaders
    })
  }

  if (!mediaRows || mediaRows.length === 0) {
    return new Response(JSON.stringify({ message: 'No media to clean' }), {
      status: 200,
      headers: corsHeaders
    })
  }

  const byBucket: Record<string, string[]> = {}
  for (const row of mediaRows) {
    if (!byBucket[row.bucket]) byBucket[row.bucket] = []
    byBucket[row.bucket].push(row.path)
  }

  for (const [bucket, paths] of Object.entries(byBucket)) {
    const { error } = await supabase.storage.from(bucket).remove(paths)
    if (error) {
      console.error(`Error removing from bucket ${bucket}:`, error)
      // Bail out: don't clean DB rows if storage failed
      return new Response(JSON.stringify({ error: 'storage_delete_failed', bucket }), {
        status: 500,
        headers: corsHeaders
      })
    }
  }

  const ids = mediaRows.map((m) => m.id)

  const { error: deleteError } = await supabase.from('media').delete().in('id', ids)

  if (deleteError) {
    console.error('Error deleting media rows:', deleteError)
    return new Response(JSON.stringify({ error: 'delete_failed' }), {
      status: 500,
      headers: corsHeaders
    })
  }

  return new Response(
    JSON.stringify({
      message: 'Media cleanup complete',
      processed: mediaRows.length
    }),
    { status: 200, headers: corsHeaders }
  )
})

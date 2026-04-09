import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string {
  if (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost'
  ) {
    return `http://${window.location.hostname}:54321`
  }
  return import.meta.env.VITE_SUPABASE_URL
}

export const supabase = createClient(getSupabaseUrl(), import.meta.env.VITE_SUPABASE_API_KEY)

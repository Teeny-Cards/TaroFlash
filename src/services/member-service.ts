import { supabase } from '@/supabase-client'
import Logger from '@/utils/logger'

export async function fetchMemberById(id: string): Promise<Member | null> {
  const { data, error } = await supabase.from('members').select('*').eq('id', id).single()

  if (error) {
    Logger.error(error.message)
    return null
  }

  return data
}

import { supabase } from '@/supabaseClient'
import Logger from '@/utils/logger'

export async function fetchMemberById(id: string): Promise<Member> {
  const { data, error } = await supabase.from('members').select('*').eq('id', id).single()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

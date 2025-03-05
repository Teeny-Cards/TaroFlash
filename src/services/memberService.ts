import { supabase } from '@/supabaseClient'
import { TeenyError } from '@/utils/TeenyError'

export async function fetchMemberById(id: string): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .select('id, display_name')
    .eq('id', id)
    .single()

  if (error) {
    throw new TeenyError(error.message)
  }

  return data
}

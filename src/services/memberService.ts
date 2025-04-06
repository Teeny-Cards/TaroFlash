import { supabase } from '@/supabaseClient'

export async function fetchMemberById(id: string): Promise<Member> {
  const { data, error } = await supabase.from('members').select('*').eq('id', id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/use-logger'

const logger = useLogger()

export async function fetchMemberById(id: string): Promise<Member | null> {
  const { data, error } = await supabase.from('members').select('*').eq('id', id).single()

  if (error) {
    logger.error(error.message)
    return null
  }

  return data
}

export async function upsertMember(member: Member): Promise<void> {
  const { error } = await supabase.from('members').upsert(member, { onConflict: 'id' })

  if (error) {
    logger.error(error.message)
    throw error
  }
}

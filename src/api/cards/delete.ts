import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

export async function deleteCardsById(ids: number[]): Promise<void> {
  const { error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

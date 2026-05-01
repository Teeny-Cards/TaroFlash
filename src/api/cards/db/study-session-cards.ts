import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'

export async function fetchStudySessionCards(
  deck_id: number,
  study_all: boolean = false
): Promise<Card[]> {
  const { data, error } = await supabase
    .rpc('get_study_session_cards', { p_deck_id: deck_id, p_study_all: study_all })
    .select('*, review:reviews(*)')

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data ?? []
}

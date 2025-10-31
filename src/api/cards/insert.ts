import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

export async function reserveCard(
  deck_id: number,
  left_card_id?: number,
  right_card_id?: number
): Promise<{ out_rank: number; out_id: number }> {
  const { data, error } = await supabase.rpc('reserve_card', {
    p_deck_id: deck_id,
    p_left_card_id: left_card_id ?? null,
    p_right_card_id: right_card_id ?? null
  })

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data[0]
}

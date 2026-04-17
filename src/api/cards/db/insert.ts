import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'

export type InsertCardParams = {
  deck_id: number
  left_card_id: number | null
  right_card_id: number | null
  front_text: string
  back_text: string
}

export async function insertCard(params: InsertCardParams): Promise<{ id: number; rank: number }> {
  const { data, error } = await supabase.rpc('insert_card', {
    p_deck_id: params.deck_id,
    p_left_card_id: params.left_card_id,
    p_right_card_id: params.right_card_id,
    p_front_text: params.front_text,
    p_back_text: params.back_text
  })

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data[0]
}

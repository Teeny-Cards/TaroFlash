import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'

export type MoveCardParams = {
  card_id: number
  anchor_id: number
  side: 'before' | 'after'
}

export async function moveCard(params: MoveCardParams): Promise<number> {
  const { data, error } = await supabase.rpc('move_card', {
    p_card_id: params.card_id,
    p_anchor_id: params.anchor_id,
    p_side: params.side
  })

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data
}

import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'

export type CardDraft = {
  front_text: string
  back_text: string
}

export type BulkInsertCardsParams = {
  deck_id: number
  cards: CardDraft[]
}

export async function bulkInsertCardsInDeck(params: BulkInsertCardsParams): Promise<Card[]> {
  const { data, error } = await supabase.rpc('bulk_insert_cards_in_deck', {
    p_deck_id: params.deck_id,
    p_cards: params.cards
  })

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data
}

import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'
import { type CardBase } from '@type/card'

export async function deleteCards(cards: CardBase[]): Promise<void> {
  const ids = cards.map((card) => card.id).filter((id) => id !== undefined)

  const { error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export type DeleteCardsInDeckParams = {
  deck_id: number
  except_ids?: number[] | null
}

export async function deleteCardsInDeck(params: DeleteCardsInDeckParams): Promise<number> {
  const { data, error } = await supabase.rpc('delete_cards_in_deck', {
    p_deck_id: params.deck_id,
    p_except_ids: params.except_ids ?? null
  })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function deleteCardImage(card_id: number, side: 'front' | 'back') {
  const { error } = await supabase
    .from('media')
    .update({ deleted_at: new Date().toISOString() })
    .eq('card_id', card_id)
    .eq('slot', `card_${side}`)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

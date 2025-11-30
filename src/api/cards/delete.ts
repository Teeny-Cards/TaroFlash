import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { type CardBase } from '@type/card'

const logger = useLogger()

export async function deleteCards(cards: CardBase[]): Promise<void> {
  const ids = cards.map((card) => card.id).filter((id) => id !== undefined)

  const { error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
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

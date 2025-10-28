import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

export async function updateCard(card: Card): Promise<void> {
  const { review, ...sanitized } = card
  sanitized.updated_at = DateTime.now().toISO()

  const { error } = await supabase.from('cards').upsert(sanitized, { onConflict: 'id' })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function updateCards(cards: Card[]): Promise<Card[]> {
  const sanitized = cards.map(({ review, ...card }) => ({
    ...card,
    updated_at: DateTime.now().toISO()
  }))

  console.log(sanitized)

  const { data, error } = await supabase
    .from('cards')
    .upsert(sanitized, { onConflict: 'id' })
    .select()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function moveCardsToDeck(cards: Card[], deck_id: number): Promise<void> {
  const sanitized = cards.map((card) => ({
    ...card,
    deck_id
  }))

  const { error } = await supabase.from('cards').update(sanitized)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

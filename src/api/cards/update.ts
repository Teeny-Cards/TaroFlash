import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

export async function upsertCard(card: Card): Promise<Card> {
  const { review, ...sanitized } = card
  sanitized.updated_at = DateTime.now().toISO()

  const { data, error } = await supabase
    .from('cards')
    .upsert(sanitized, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function upsertCards(cards: Card[]): Promise<Card[]> {
  const sanitized = cards.map(({ review, ...card }) => ({
    ...card,
    updated_at: DateTime.now().toISO()
  }))

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

export async function reorderCard(
  card_id: number,
  left_card_id?: number,
  right_card_id?: number
): Promise<void> {
  const { error } = await supabase.rpc('reorder_card', {
    p_card_id: card_id,
    p_left_card_id: left_card_id ?? null,
    p_right_card_id: right_card_id ?? null
  })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function moveCardsToDeck(cards: Card[], deck_id: number): Promise<void> {
  const sanitized = cards.map((card) => ({
    ...card,
    deck_id
  }))

  const { error } = await supabase.from('cards').upsert(sanitized)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

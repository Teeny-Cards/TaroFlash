import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

export async function updateCard(card: Card): Promise<void> {
  const { review, ...rest } = card
  rest.updated_at = DateTime.now().toISO()

  const { error } = await supabase.from('cards').upsert(rest)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function updateCards(cards: Card[]): Promise<Card[]> {
  const sanitized = cards.map(({ review, ...rest }) => ({
    ...rest,
    updated_at: DateTime.now().toISO()
  }))

  const { data, error } = await supabase.from('cards').upsert(sanitized).select()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

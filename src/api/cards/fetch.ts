import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

export async function fetchAllCardsByDeckId(deck_id: number): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*, review:reviews(*)')
    .eq('deck_id', deck_id)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function fetchDueCardsByDeckId(deck_id: number): Promise<Card[]> {
  const end_of_day = DateTime.now().endOf('day').toISO()

  const { data, error } = await supabase
    .from('cards')
    .select('*, review:reviews(*)')
    .eq('deck_id', deck_id)
    .or(`due.is.null,due.lte.${end_of_day}`, { referencedTable: 'cards.reviews' })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

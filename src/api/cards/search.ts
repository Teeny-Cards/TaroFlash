import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

export async function searchCardsInDeck(deck_id: number, query: string): Promise<Card[]> {
  const search_query = `%${query}%`

  const { data, error } = await supabase
    .from('cards')
    .select('*, review:reviews(*)')
    .eq('deck_id', deck_id)
    .or(`front_text.ilike.${search_query},back_text.ilike.${search_query}`)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

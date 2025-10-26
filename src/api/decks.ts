import { supabase } from '@/supabase-client'
import { useSessionStore } from '@/stores/session'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

export async function fetchMemberDecks(): Promise<Deck[]> {
  const { data, error } = await supabase.rpc('get_member_decks_with_due_count', {
    p_member_id: useSessionStore().user_id,
    p_now: DateTime.now().toISO()
  })

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data
}

export async function fetchDeck(id: number): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .select('*, cards(*, review:reviews(*)), member:members(display_name)')
    .eq('id', id)
    .order('order', { ascending: true, referencedTable: 'cards' })
    .single()

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data
}

export async function upsertDeck(deck: Deck): Promise<void> {
  deck.updated_at = DateTime.now().toISO()
  const { error } = await supabase.from('decks').upsert(deck, { onConflict: 'id' })

  if (error) {
    logger.error(error.message)
    throw error
  }
}

export async function deleteDeck(id: number): Promise<void> {
  const { error } = await supabase.from('decks').delete().eq('id', id)

  if (error) {
    logger.error(error.message)
    throw error
  }
}

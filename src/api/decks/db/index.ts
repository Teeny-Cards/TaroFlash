import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import logger from '@/utils/logger'
import { isoNow, localDayStart } from '@/utils/date'

export async function fetchMemberDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .rpc('decks_with_stats', { p_today_start: localDayStart() })
    .select('*')
    .eq('member_id', useMemberStore().id)

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data
}

export async function fetchDeck(id: number): Promise<Deck> {
  const { data, error } = await supabase
    .rpc('decks_with_stats', { p_today_start: localDayStart() })
    .select('*, member:members(display_name)')
    .eq('id', id)
    .single()

  if (error) {
    logger.error(error.message)
    throw error
  }

  return data as Deck
}

export async function fetchMemberDeckCount(): Promise<number> {
  const { count, error } = await supabase
    .from('decks')
    .select('*', { count: 'exact', head: true })
    .eq('member_id', useMemberStore().id)

  if (error) {
    logger.error(error.message)
    throw error
  }

  return count ?? 0
}

export async function upsertDeck(deck: Deck): Promise<void> {
  deck.updated_at = isoNow()
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

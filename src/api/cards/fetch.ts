import { supabase } from '@/supabase-client'
import { useSessionStore } from '@/stores/session'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'

const logger = useLogger()

type FetchMemberCardCountOptions = {
  only_due_cards?: boolean
}

export async function fetchMemberCardCount(opts: FetchMemberCardCountOptions): Promise<number> {
  const { data, error } = await supabase.rpc('get_member_card_count', {
    p_member_id: useSessionStore().user_id,
    p_now: DateTime.now().toISO(),
    p_only_due_cards: opts.only_due_cards
  })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function fetchAllCardsByDeckId(deck_id: number): Promise<Card[]> {
  const { data, error } = await supabase
    .from('card_with_images')
    .select('*, review:reviews(*)')
    .eq('deck_id', deck_id)
    .order('rank', { ascending: true })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function fetchDueCardsByDeckId(deck_id: number): Promise<Card[]> {
  const end_of_day = DateTime.now().endOf('day').toISO()

  const { data, error } = await supabase
    .from('card_with_images')
    .select('*, review:reviews(*)')
    .eq('deck_id', deck_id)
    .or(`due.is.null,due.lte.${end_of_day}`, { referencedTable: 'cards.reviews' })
    .order('rank', { ascending: true })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

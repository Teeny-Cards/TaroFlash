import { deleteCardsByDeckId } from '@/services/cardService'
import { supabase } from '@/supabaseClient'
import Logger from '@/utils/logger'
import { DateTime } from 'luxon'

export async function createDeck(deck: Deck, member_id: string): Promise<any> {
  const { id, ...data } = deck

  data.member_id = member_id

  const { error } = await supabase.from('decks').insert(data)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function fetchMemberDecks(member_id: string): Promise<Deck[]> {
  const today_iso = DateTime.now().toISODate()

  const { data, error } = await supabase
    .from('decks')
    .select('description,title, image_url, id, due_cards:cards(*, review:reviews!inner(*))')
    .eq('member_id', member_id)
    .lte('cards.reviews.due', today_iso)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function fetchDeckById(id: string): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .select('*, cards(*, review:reviews(*)), member:members(display_name)')
    .eq('id', id)
    .order('order', { ascending: true, referencedTable: 'cards' })
    .single()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function updateDeckById(id: string, deck: Deck): Promise<void> {
  const { error } = await supabase.from('decks').update(deck).eq('id', id)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function deleteDeckById(id: string): Promise<void> {
  const { error } = await supabase.from('decks').delete().eq('id', id)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  await deleteCardsByDeckId(id)
}

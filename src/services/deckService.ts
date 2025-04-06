import { deleteCardsByDeckId } from '@/services/cardService'
import { supabase } from '@/supabaseClient'
import { useMemberStore } from '@/stores/member'
import Logger from '@/utils/logger'

export async function createDeck(deck: Deck): Promise<any> {
  const { id, ...data } = deck

  data.member_id = useMemberStore().id

  const { error } = await supabase.from('decks').insert(data)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function fetchUserDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .from('decks')
    .select('description, title, image_url, id')
    .eq('member_id', useMemberStore().id)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function fetchDeckById(id: string): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .select('*, cards(*), member:members(display_name)')
    .eq('id', id)
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

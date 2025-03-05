import { TeenyError } from '@/utils/TeenyError'
import { deleteCardsByDeckId } from '@/services/cardService'
import { supabase } from '@/supabaseClient'
import { useUserStore } from '@/stores/member'

export async function createDeck(deck: Deck): Promise<any> {
  const { id, image, ...data } = deck

  data.member_id = useUserStore().id

  const { error } = await supabase.from('decks').insert(data)

  if (error) {
    throw new TeenyError(error.message)
  }
}

export async function fetchUserDecks(): Promise<Deck[]> {
  const { data, error } = await supabase.from('decks').select().eq('member_id', useUserStore().id)

  if (error) {
    throw new TeenyError(error.message)
  }

  return data
}

export async function fetchDeckById(id: string): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .select('*, cards(*), member:members(display_name)')
    .eq('id', id)

  if (error) {
    throw new TeenyError(error.message)
  }

  return data[0]
}

export async function updateDeckById(id: string, deck: Deck): Promise<void> {
  const { error } = await supabase.from('decks').update(deck).eq('id', id)

  if (error) {
    throw new TeenyError(error.message)
  }
}

export async function deleteDeckById(id: string): Promise<void> {
  const { error } = await supabase.from('decks').delete().eq('id', id)

  if (error) {
    throw new TeenyError(error.message)
  }

  await deleteCardsByDeckId(id)
}

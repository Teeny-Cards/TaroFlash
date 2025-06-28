import { supabase } from '@/supabase-client'
import Logger from '@/utils/logger'
import { useMemberStore } from '@/stores/member'

export async function saveCards(cards: Card[]): Promise<Card[]> {
  const { data, error } = await supabase.from('cards').upsert(cards).select()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function createCard(card: Card): Promise<Card> {
  const member_id = useMemberStore().id

  const { data, error } = await supabase
    .from('cards')
    .insert({ ...card, member_id })
    .select()
    .single()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function updateReviewByCardId(id: number, review: Review): Promise<Card> {
  const member_id = useMemberStore().id

  const { error, data } = await supabase
    .from('reviews')
    .upsert({ ...review, member_id, card_id: id }, { onConflict: 'card_id' })
    .single()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function deleteCardsByDeckId(deck_id: number): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('deck_id', deck_id)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function deleteCardById(card_id: number): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', card_id)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

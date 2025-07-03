import { supabase } from '@/supabase-client'
import Logger from '@/utils/logger'

export async function updateCards(cards: Card[]): Promise<Card[]> {
  const sanitized = cards.map(({ review, ...rest }) => rest)

  const { data, error } = await supabase.from('cards').upsert(sanitized).select()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function createCard(card: Card): Promise<Card> {
  const { data, error } = await supabase
    .from('cards')
    .insert({ ...card })
    .select()
    .single()

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function updateReviewByCardId(id: number, review: Review): Promise<Card> {
  const { error, data } = await supabase
    .from('reviews')
    .upsert({ ...review, card_id: id }, { onConflict: 'card_id' })
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

export async function deleteCardsById(ids: number[]): Promise<void> {
  const { data, error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    Logger.error(error.message)
    throw new Error(error.message)
  }
}

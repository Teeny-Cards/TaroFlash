import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/use-logger'
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

export async function updateCards(cards: Card[]): Promise<Card[]> {
  const sanitized = cards.map(({ review, ...rest }) => ({
    ...rest,
    updated_at: DateTime.now().toISO()
  }))

  const { data, error } = await supabase.from('cards').upsert(sanitized).select()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function updateCard(card: Card): Promise<void> {
  const { review, ...rest } = card
  rest.updated_at = DateTime.now().toISO()

  const { error } = await supabase.from('cards').upsert(rest)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function createCard(card: Card): Promise<Card> {
  const { data, error } = await supabase
    .from('cards')
    .insert({ ...card })
    .select()
    .single()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function deleteCardsByDeckId(deck_id: number): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('deck_id', deck_id)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function deleteCardsById(ids: number[]): Promise<void> {
  const { error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

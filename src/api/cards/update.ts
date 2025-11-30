import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { DateTime } from 'luxon'
import { uploadImage, insertMedia, deleteImage } from '@/api/media'
import uid from '@/utils/uid'
import { type CardBase } from '@type/card'

const logger = useLogger()

export async function upsertCard(card: CardBase): Promise<Card> {
  const sanitized = {
    ...card,
    updated_at: DateTime.now().toISO()
  }

  const { data, error } = await supabase
    .from('cards')
    .upsert(sanitized, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function upsertCards(cards: CardBase[]): Promise<Card[]> {
  const sanitized = cards.map((card) => ({
    ...card,
    updated_at: DateTime.now().toISO()
  }))

  const { data, error } = await supabase
    .from('cards')
    .upsert(sanitized, { onConflict: 'id' })
    .select()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

export async function reorderCard(
  card_id: number,
  left_card_id?: number,
  right_card_id?: number
): Promise<void> {
  const { error } = await supabase.rpc('reorder_card', {
    p_card_id: card_id,
    p_left_card_id: left_card_id ?? null,
    p_right_card_id: right_card_id ?? null
  })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function moveCardsToDeck(cards: CardBase[], deck_id: number): Promise<void> {
  const sanitized = cards.map((card) => ({
    ...card,
    deck_id
  }))

  const { error } = await supabase.from('cards').upsert(sanitized)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export async function setCardImage(card_id: number, file: File, side: 'front' | 'back') {
  const bucket = 'cards'
  const path = `${card_id}/${side}/${uid()}.${file.type.split('/')[1]}`

  try {
    await uploadImage(bucket, path, file)
    await insertMedia({ bucket, path, card_id, slot: `card_${side}` })
  } catch (e) {
    await deleteImage(bucket, path)
    throw e
  }
}

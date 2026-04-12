import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'
import { DateTime } from 'luxon'
import { uploadImage, insertMedia, deleteMediaByPath, deduplicateSlotMedia } from '@/api/media'
import uid from '@/utils/uid'
import { type CardBase } from '@type/card'

export async function upsertCard(card: Partial<CardBase>): Promise<Card> {
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

export async function upsertCards(cards: Partial<CardBase>[]): Promise<Card[]> {
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
  const slot = `card_${side}` as const
  const path = `${card_id}/${side}/${uid()}.${file.type.split('/')[1]}`

  // Insert the DB record first. If the upload then fails we can easily delete
  // this row — it's safer than orphaning a storage file with no DB record.
  await insertMedia({ bucket, path, card_id, slot })

  try {
    await uploadImage(bucket, path, file)
  } catch (e) {
    // Upload failed — roll back the DB record. Log if the rollback itself fails
    // so the dangling row is visible in logs.
    deleteMediaByPath(card_id, path).catch((rollbackErr) =>
      logger.error(
        `Failed to rollback media record after upload failure — path: ${path}`,
        rollbackErr
      )
    )
    throw e
  }

  // Soft-delete previous records for this slot so card_with_images doesn't
  // return duplicate rows when joining on (card_id, slot, deleted_at IS NULL).
  await deduplicateSlotMedia(card_id, slot, path).catch((err) =>
    logger.error('Failed to dedup slot media after upload:', err)
  )
}

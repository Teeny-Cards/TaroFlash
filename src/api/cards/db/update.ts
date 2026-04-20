import { supabase } from '@/supabase-client'
import logger from '@/utils/logger'
import { isoNow } from '@/utils/date'
import { uploadImage, insertMedia } from '@/api/media/db'
import { useMemberStore } from '@/stores/member'
import uid from '@/utils/uid'
import { buildCardPayload, hasCardChanges } from '@/utils/card/payload'
import { type CardBase } from '@type/card'

/**
 * In-place update + upsert for an existing card. Skips the network round-trip
 * if `values` introduces no actual change. Caller-side debouncing lives in
 * the `useSaveCardMutation` wrapper, not here.
 */
export async function saveCard(card: Card, values: Partial<Card>): Promise<void> {
  if (!card.id) return
  if (!hasCardChanges(card, values)) return

  Object.assign(card, values)
  await upsertCard(buildCardPayload(card))
}

export async function upsertCard(card: Partial<CardBase>): Promise<Card> {
  const sanitized = {
    ...card,
    updated_at: isoNow()
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
    updated_at: isoNow()
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
  const member_id = useMemberStore().id
  if (!member_id) throw new Error('Not authenticated')

  const bucket = 'cards'
  const slot = `card_${side}` as const
  // Path includes member_id so any viewer (not just the owner) builds a
  // correct storage URL. The storage policies enforce that only the owner
  // can INSERT/UPDATE/DELETE under their own folder.
  const path = `${member_id}/${card_id}/${side}/${uid()}.${file.type.split('/')[1]}`

  // Upload first so we don't soft-delete the previous image (via the DB
  // trigger on insertMedia) until the new file is actually in storage.
  // Failure mode: upload fails → nothing changed.
  //                insertMedia fails → storage file is orphaned, reaped by
  //                cleanup-media cron.
  await uploadImage(bucket, path, file)
  await insertMedia({ bucket, path, card_id, slot })
}

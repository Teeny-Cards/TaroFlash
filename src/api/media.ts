import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import logger from '@/utils/logger'

export async function uploadImage(bucket: string, path: string, file: File): Promise<string> {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${path}`

  const { error } = await supabase.storage.from(bucket).upload(full_path, file, { upsert: true })

  if (error) {
    logger.error(`Error uploading file: ${error.message}`)
    throw new Error(error.message)
  }

  return getImageUrl(bucket, path)
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${path}`
  const { error } = await supabase.storage.from(bucket).remove([full_path])

  if (error) {
    logger.error(`Error deleting file: ${error.message}`)
    throw new Error(error.message)
  }
}

export function getImageUrl(bucket: string, path: string): string {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${path}`

  return supabase.storage.from(bucket).getPublicUrl(full_path).data.publicUrl
}

export async function insertMedia(params: Media): Promise<void> {
  if (!params.card_id && !params.deck_id) {
    throw new Error('insertMedia requires either card_id or deck_id')
  }

  const { error } = await supabase.from('media').insert(params)

  if (error) {
    logger.error(`Failed to insert media: ${error}`)
    throw error
  }
}

export async function deleteMedia(id: string): Promise<void> {
  const { error } = await supabase.from('media').update({ deleted_at: new Date() }).eq('id', id)

  if (error) {
    logger.error(`Failed to delete media: ${error}`)
    throw error
  }
}

// Hard-deletes a specific media record by card + storage path.
// Used to roll back an insertMedia when a subsequent upload fails.
export async function deleteMediaByPath(card_id: number, path: string): Promise<void> {
  const { error } = await supabase.from('media').delete().eq('card_id', card_id).eq('path', path)

  if (error) {
    logger.error(`Failed to delete media by path: ${error}`)
    throw error
  }
}

// Soft-deletes all active media records for a given card slot except the one
// at keep_path. Prevents the card_with_images view from joining multiple active
// rows for the same slot and returning duplicate cards.
export async function deduplicateSlotMedia(
  card_id: number,
  slot: string,
  keep_path: string
): Promise<void> {
  const { error } = await supabase
    .from('media')
    .update({ deleted_at: new Date().toISOString() })
    .eq('card_id', card_id)
    .eq('slot', slot)
    .neq('path', keep_path)
    .is('deleted_at', null)

  if (error) {
    logger.error(`Failed to dedup slot media: ${error}`)
    throw error
  }
}

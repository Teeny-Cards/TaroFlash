import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

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
    console.error('Failed to insert media:', error)
    throw error
  }
}

export async function deleteMedia(id: string): Promise<void> {
  const { error } = await supabase.from('media').update({ deleted_at: new Date() }).eq('id', id)

  if (error) {
    console.error('Failed to delete media:', error)
    throw error
  }
}

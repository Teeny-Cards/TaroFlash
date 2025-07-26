import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import Logger from '@/utils/logger'

type Bucket = 'deck-images'

export async function uploadDeckImage(deck_id: number, file: File): Promise<void> {
  await uploadImage('deck-images', `deck-${deck_id}`, file)
}

export async function deleteDeckImage(deck_id: number): Promise<void> {
  await deleteImage('deck-images', `deck-${deck_id}`)
}

export function getDeckImageUrl(deck_id: number): string {
  return getImageUrl('deck-images', `deck-${deck_id}`)
}

export async function uploadImage(bucket: string, image_name: string, file: File): Promise<void> {
  const member_id = useMemberStore().id
  const file_path = `${member_id}/${image_name}`

  const { error } = await supabase.storage.from(bucket).upload(file_path, file, { upsert: true })

  if (error) {
    Logger.error(`Error uploading file: ${error.message}`)
    throw new Error(error.message)
  }
}

export async function deleteImage(bucket: string, file_name: string): Promise<void> {
  const member_id = useMemberStore().id
  const full_path = `${member_id}/${file_name}`

  const { error } = await supabase.storage.from(bucket).remove([full_path])

  if (error) {
    Logger.error(`Error deleting file: ${error.message}`)
    throw new Error(error.message)
  }
}

export function getImageUrl(bucket: Bucket, file_path: string): string {
  const full_path = `${useMemberStore().id}/${file_path}`
  return supabase.storage.from(bucket).getPublicUrl(full_path).data.publicUrl
}

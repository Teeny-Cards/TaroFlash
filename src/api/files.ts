import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

export async function uploadImage(file_name: string, file: File): Promise<string> {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${file_name}`

  const { error } = await supabase.storage.from('images').upload(full_path, file, { upsert: true })

  if (error) {
    logger.error(`Error uploading file: ${error.message}`)
    throw new Error(error.message)
  }

  return getImageUrl(file_name)
}

export async function deleteImage(file_name: string): Promise<void> {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${file_name}`
  const { error } = await supabase.storage.from('images').remove([full_path])

  if (error) {
    logger.error(`Error deleting file: ${error.message}`)
    throw new Error(error.message)
  }
}

export function getImageUrl(file_name: string): string {
  const member_id = useMemberStore().id

  if (!member_id) {
    throw new Error('Not authenticated')
  }

  const full_path = `${member_id}/${file_name}`

  return supabase.storage.from('images').getPublicUrl(full_path).data.publicUrl
}

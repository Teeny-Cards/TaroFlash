import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import Logger from '@/utils/logger'

type TransformOptions = {
  width?: number
  height?: number
  resize?: 'cover' | 'contain' | 'fill'
  quality?: number
  format?: 'origin'
}

type Bucket = 'deck-images'

export async function uploadImage(bucket: string, file: File, member_id: string): Promise<string> {
  const file_path = `${member_id}/${file.name}`

  try {
    await supabase.storage.from(bucket).upload(file_path, file)

    const { data } = supabase.storage.from(bucket).getPublicUrl(file_path)
    return data.publicUrl
  } catch (error: any) {
    Logger.error(`Error uploading file: ${error.message}`)
    throw new Error(error.message)
  }
}

export function getImageUrl(bucket: Bucket, file_path: string, options?: TransformOptions): string {
  if (import.meta.env.DEV) {
    options = undefined
  }

  const full_path = `${useMemberStore().id}/${file_path}`
  return supabase.storage.from(bucket).getPublicUrl(full_path, { transform: options }).data
    .publicUrl
}

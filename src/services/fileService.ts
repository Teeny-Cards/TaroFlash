import { supabase } from '@/supabaseClient'
import { useMemberStore } from '@/stores/member'
import Logger from '@/utils/logger'

export async function uploadImage(bucket: string, file: File): Promise<string> {
  Logger.info(`Uploading image to bucket: ${bucket}`)
  const user_id = useMemberStore().id
  const file_path = `${user_id}/${file.name}`

  try {
    await supabase.storage.from(bucket).upload(file_path, file)
    Logger.debug(`File uploaded successfully: ${file_path}`)

    const { data } = supabase.storage.from(bucket).getPublicUrl(file_path)
    return data.publicUrl
  } catch (error: any) {
    Logger.error(`Error uploading file: ${error.message}`)
    throw new Error(error.message)
  }
}

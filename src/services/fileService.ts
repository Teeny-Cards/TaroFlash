import { supabase } from '@/supabaseClient'
import Logger from '@/utils/logger'

export async function uploadImage(bucket: string, file: File, member_id: string): Promise<string> {
  Logger.debug(`Uploading image to bucket: ${bucket}`)
  const file_path = `${member_id}/${file.name}`

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

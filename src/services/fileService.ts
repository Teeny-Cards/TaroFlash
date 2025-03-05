// import { TeenyError } from '@/utils/TeenyError'
import { supabase } from '@/supabaseClient'
import { useMemberStore } from '@/stores/member'

export async function uploadImage(bucket: string, file: File): Promise<string> {
  const user_id = useMemberStore().id
  const file_path = `${user_id}/${file.name}`

  await supabase.storage.from(bucket).upload(file_path, file)

  const { data } = supabase.storage.from(bucket).getPublicUrl(file_path)

  console.log(data.publicUrl)
  return data.publicUrl
}

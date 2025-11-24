import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/logger'
import { deleteImage } from '@/api/files'

const logger = useLogger()

export async function deleteCards(cards: Card[]): Promise<void> {
  const image_ids = cards.flatMap((card) => card.image_ids ?? [])
  await Promise.all(image_ids.map((id) => deleteImage(id)))

  const ids = cards.map((card) => card.id).filter((id) => id !== undefined)

  const { error } = await supabase.from('cards').delete().in('id', ids)

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

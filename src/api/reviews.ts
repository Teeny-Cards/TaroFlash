import { supabase } from '@/supabase-client'
import { useLogger } from '@/composables/use-logger'

const logger = useLogger()

export async function updateReviewByCardId(id: number, review: Review): Promise<Card> {
  const { error, data } = await supabase
    .from('reviews')
    .upsert({ ...review, card_id: id }, { onConflict: 'card_id' })
    .single()

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}

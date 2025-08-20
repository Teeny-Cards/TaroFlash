import { getCardImageUrl } from '@/api/files'
import { computed } from 'vue'

export function useCard(card?: Card) {
  const front_image_url = computed(() => {
    if (!card?.has_front_image) return undefined

    const url = card?.id ? getCardImageUrl(card.id, 'front') : undefined
    return url ? `${url}?t=${card?.updated_at}` : undefined
  })

  const back_image_url = computed(() => {
    if (!card?.has_back_image) return undefined

    const url = card?.id ? getCardImageUrl(card.id, 'back') : undefined
    return url ? `${url}?t=${card?.updated_at}` : undefined
  })

  return { front_image_url, back_image_url }
}

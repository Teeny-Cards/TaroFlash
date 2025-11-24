import { type CardInput as FSRSCard } from 'ts-fsrs'
import { type CardAttributes } from '@/composables/rich-text-editor'

declare global {
  type Review = FSRSCard

  type Card = {
    id: number
    deck_id?: number
    front_text?: string
    back_text?: string
    front_delta?: Object
    back_delta?: Object
    attributes?: CardAttributes
    created_at?: string
    updated_at?: string
    rank?: number
    review?: Review
    member_id?: string
    image_ids?: string[]
  }
}

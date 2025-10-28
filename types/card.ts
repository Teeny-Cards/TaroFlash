import { type CardInput as FSRSCard } from 'ts-fsrs'

declare global {
  type Review = FSRSCard

  type Card = {
    front_text?: string
    back_text?: string
    deck_id?: number
    id?: number
    created_at?: string
    updated_at?: string
    has_front_image?: boolean
    has_back_image?: boolean
    order?: number
    review?: Review
    member_id?: string
  }
}

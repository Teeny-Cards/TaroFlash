import { type CardInput as FSRSCard } from 'ts-fsrs'

declare global {
  type Review = FSRSCard

  type Card = {
    front_text?: string
    back_text?: string
    deck_id?: number
    id?: number
    created_at?: Date
    updated_at?: Date
    order?: number
    review?: Review
  }
}

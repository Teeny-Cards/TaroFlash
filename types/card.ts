import { type Card as FSRSCard } from 'ts-fsrs'

declare global {
  type Review = FSRSCard

  type Card = {
    front_text: string
    back_text: string
    deck_id?: string
    id?: string
    created_at?: Date
    updated_at?: Date
    order?: number
    review?: Review
  }
}

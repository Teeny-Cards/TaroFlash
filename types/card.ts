import { type CardInput as FSRSCard } from 'ts-fsrs'

declare global {
  type Review = FSRSCard

  type Card = {
    id: number
    deck_id?: number
    front_text?: string
    back_text?: string
    front_delta?: Object
    back_delta?: Object
    created_at?: string
    updated_at?: string
    has_front_image?: boolean
    has_back_image?: boolean
    rank?: number
    review?: Review
    member_id?: string
  }
}

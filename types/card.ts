import { type CardInput as FSRSCard } from 'ts-fsrs'

export type CardBase = {
  id: number
  deck_id?: number
  front_text?: string
  back_text?: string
  created_at?: string
  updated_at?: string
  rank?: number
  member_id?: string
}

export type Review = FSRSCard

export type ImageCard = {
  front_image_path?: string
  back_image_path?: string
}

export type ReviewCard = {
  review?: Review
}

declare global {
  type Review = FSRSCard
  type Card = Prettify<CardBase & ImageCard & ReviewCard>
}

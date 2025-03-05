type Card = {
  order: number
  front_text: string
  back_text: string
  deck_id?: string
  id: string
  image_url?: string
  audio_clip?: string
  due_date?: Date
  last_updated?: Date
  state?: CardState
  interval?: number
  ease?: number
  leech_count?: number
  streak?: number
}

type CardMutation = Card & {
  deleted?: boolean
  dirty?: boolean
}

type CardState = 'new' | 'learning' | 'young' | 'mature' | 'relearn'

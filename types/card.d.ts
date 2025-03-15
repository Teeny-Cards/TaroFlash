type Card = {
  front_text: string
  back_text: string
  deck_id?: string
  id?: number
  last_updated?: Date
}

type CardState = 'new' | 'learning' | 'young' | 'mature' | 'relearn'

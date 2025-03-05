type Card = {
  front_text: string
  back_text: string
  deck_id?: string
  id?: string
  last_updated?: Date
}

type CardState = 'new' | 'learning' | 'young' | 'mature' | 'relearn'

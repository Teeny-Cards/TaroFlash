type Card = {
  front_text: string
  back_text: string
  deck_id?: string
  id?: string
  created_at?: Date
  updated_at?: Date
  due_date?: Date
  state?: CardState
  interval?: number
  ease?: number
  order?: number
}

type CardState = 'new' | 'learning' | 'young' | 'mature' | 'relearn'

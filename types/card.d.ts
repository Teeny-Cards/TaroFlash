type Card = {
  front_text: string
  back_text: string
  deck_id?: string
  id?: string
  created_at?: Date
  updated_at?: Date
  order?: number

  // FSRS properties
  difficulty: number
  due: Date
  elapsed_days: number
  lapses: number
  last_review?: Date
  learning_steps: number
  reps: number
  scheduled_days: number
  stability: number
  state: State
}

enum State {
  New = 0,
  Learning = 1,
  Relearning = 2,
  Review = 3
}

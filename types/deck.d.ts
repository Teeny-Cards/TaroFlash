type Deck = {
  id?: number
  created_at?: string
  updated_at?: string
  description?: string
  is_public?: boolean
  title?: string
  member_id?: number
  member?: { display_name: string }
  cards?: Card[]
  tags?: string[]
  due_cards?: Card[]
  config?: DeckConfig
}

type DeckConfig = {
  study_all_cards: boolean
  retry_failed_cards: boolean
}

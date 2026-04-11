type Deck = {
  id: number
  created_at?: string
  updated_at?: string
  description?: string
  is_public?: boolean
  title?: string
  member_id?: number
  member?: { display_name: string }
  cards?: Card[]
  tags?: string[]
  due_count?: number
  config?: DeckConfig
  has_image?: boolean
  card_count?: number
}

type DeckStudyMode = 'flashcard'

type DeckConfig = {
  study_mode?: DeckStudyMode
  study_all_cards: boolean
  retry_failed_cards: boolean
  shuffle?: boolean
  card_limit?: number | null
  flip_cards?: boolean
}

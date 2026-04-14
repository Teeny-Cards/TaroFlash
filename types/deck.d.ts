type CardAttributes = {
  horizontal_alignment?: 'left' | 'center' | 'right'
  vertical_alignment?: 'top' | 'center' | 'bottom'
  text_size?: 'small' | 'medium' | 'large' | 'x-large' | 'huge' | 'ginormous'
}

type DeckCardAttributes = {
  front: CardAttributes
  back: CardAttributes
}

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
  study_config?: DeckConfig
  cover_config?: DeckCover
  card_attributes?: DeckCardAttributes
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
  is_spaced?: boolean
  auto_play?: boolean
}

type DeckCoverPattern =
  | 'diagonal-stripes'
  | 'saw'
  | 'wave'
  | 'bank-note'
  | 'aztec'
  | 'endless-clouds'
  | 'stars'
  | 'leaf'
  | 'dot-grid'

type DeckCover = {
  bg_color?: MemberTheme
  border_color?: MemberTheme
  border_size?: number
  pattern?: DeckCoverPattern
  pattern_color?: MemberTheme
  pattern_size?: number
  pattern_opacity?: number
  bg_image?: string
}

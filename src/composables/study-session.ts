import { ref, computed, shallowRef, reactive } from 'vue'
import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type IPreview,
  type RecordLogItem
} from 'ts-fsrs'
import { DateTime } from 'luxon'
import { updateReviewByCardId } from '@/api/reviews'

export type StudyMode = 'studying' | 'completed'
export type StudyCard = Card & { preview?: IPreview; state: ReviewState }

type ReviewState = 'failed' | 'passed' | 'unreviewed'

export function useStudySession(_config?: DeckConfig) {
  const _PARAMS = generatorParameters({
    enable_fuzz: true,
    learning_steps: [],
    relearning_steps: []
  })

  const config = reactive<Required<DeckConfig>>({
    study_all_cards: _config?.study_all_cards ?? false,
    retry_failed_cards: _config?.retry_failed_cards ?? false,
    shuffle: _config?.shuffle ?? false,
    card_limit: _config?.card_limit ?? null,
    flip_cards: _config?.flip_cards ?? false
  })

  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)
  const _raw_cards = shallowRef<Card[]>([])
  const _cards_in_deck = shallowRef<StudyCard[]>([])
  const _retry_cards = shallowRef<StudyCard[]>([])

  const mode = ref<StudyMode>('studying')
  const current_card_side = ref<'front' | 'back' | 'cover'>('cover')
  const active_card = shallowRef<StudyCard | undefined>(undefined)

  const starting_side = computed<'front' | 'back'>(() => (config.flip_cards ? 'back' : 'front'))

  const is_starting_side = computed(() => current_card_side.value === starting_side.value)

  const cards = computed(() => {
    if (!config.retry_failed_cards) return _cards_in_deck.value

    return [..._cards_in_deck.value, ..._retry_cards.value]
  })

  const num_correct = computed(() => cards.value.filter((c) => c.state === 'passed').length)
  const reviewed_cards = computed(() => cards.value.filter((c) => c.state !== 'unreviewed'))
  const reviewed_count = computed(() => reviewed_cards.value.length)

  const remaining_due_count = computed(() => {
    if (config.study_all_cards) return 0
    const total_due = _raw_cards.value.filter(_isCardDue).length

    return Math.max(0, total_due - reviewed_count.value)
  })

  const current_index = computed(() => {
    if (!active_card.value) return cards.value.length
    return cards.value.findIndex((c) => c.id === active_card.value!.id)
  })

  function setCards(cards: Card[]) {
    _raw_cards.value = cards
    _processCards()
  }

  function updateConfig(updates: Partial<DeckConfig>) {
    config.study_all_cards = updates.study_all_cards ?? config.study_all_cards
    config.retry_failed_cards = updates.retry_failed_cards ?? config.retry_failed_cards
    config.shuffle = updates.shuffle ?? config.shuffle
    config.card_limit = updates.card_limit ?? config.card_limit
    config.flip_cards = updates.flip_cards ?? config.flip_cards

    if (_raw_cards.value.length) _processCards()
  }

  function _processCards() {
    let filtered = [..._raw_cards.value]

    if (!config.study_all_cards) {
      filtered = filtered.filter(_isCardDue)
    }

    if (config.shuffle) {
      filtered = filtered.sort(() => Math.random() - 0.5)
    }

    if (config.card_limit) {
      filtered = filtered.slice(0, config.card_limit)
    }

    _cards_in_deck.value = filtered.map(_setupCard)

    _pickNextCard({ first: true })
  }

  function startSession() {
    if (_cards_in_deck.value.length === 0) {
      updateConfig({ study_all_cards: true })
      _processCards()
    }

    current_card_side.value = starting_side.value
  }

  function flipCurrentCard() {
    current_card_side.value = current_card_side.value === 'front' ? 'back' : 'front'
  }

  function _pickNextCard({ first }: { first?: boolean } = {}) {
    current_card_side.value = first ? 'cover' : starting_side.value
    active_card.value = cards.value.find((c) => c.state === 'unreviewed')

    if (!active_card.value) {
      mode.value = 'completed'
    }
  }

  function reviewCard(item?: RecordLogItem) {
    if (!active_card.value) return

    const card = active_card.value

    if (item) {
      // Capture whether the card was due today before overwriting the review —
      // _retryCard needs this to decide whether to re-queue the card today.
      // review.due may be a Date object (from createEmptyCard) or an ISO string (from Supabase).
      const was_due_today = _isDueToday(card.review?.due)
      card.review = item.card
      _markCurrentCardStudied(item.log.rating, was_due_today)
    } else {
      card.state = 'passed'
    }

    _pickNextCard()

    if (card.id && item) {
      return updateReviewByCardId(card.id, item.card)
    }
  }

  function _setupCard(card: Card): StudyCard {
    const review = card.review ?? (createEmptyCard(new Date()) as Review)
    const preview = _FSRS_INSTANCE.repeat(review, new Date())

    return { state: 'unreviewed', ...card, review, preview }
  }

  function _markCurrentCardStudied(rating?: Rating, was_due_today = false) {
    const card = active_card.value
    if (!card || !card.id) return

    if (rating === Rating.Again) {
      card.state = 'failed'
      if (was_due_today) _retryCard(card)
    } else {
      card.state = 'passed'
    }
  }

  function _retryCard(card: StudyCard) {
    if (!config.retry_failed_cards) return

    const retry_card = _setupCard(card)
    _retry_cards.value = [..._retry_cards.value, retry_card]
  }

  function _isDueToday(due: Date | string | number | undefined): boolean {
    if (!due) return true
    const dt = due instanceof Date ? DateTime.fromJSDate(due) : DateTime.fromISO(String(due))
    return dt.toLocal().hasSame(DateTime.local(), 'day')
  }

  function _isCardDue(card: Card) {
    if (!card.review?.due) return true

    const due = DateTime.fromISO(card.review?.due as string)
    const now = DateTime.now()

    return due <= now
  }

  return {
    mode,
    current_card_side,
    active_card,
    cards,
    num_correct,
    reviewed_count,
    remaining_due_count,
    current_index,
    is_starting_side,
    config,
    setCards,
    updateConfig,
    startSession,
    flipCurrentCard,
    reviewCard
  }
}

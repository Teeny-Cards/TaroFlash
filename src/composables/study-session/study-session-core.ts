import { ref, computed, shallowRef, reactive } from 'vue'
import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type Grade,
  type RecordLog
} from 'ts-fsrs'
import { DateTime } from 'luxon'
import { saveReview } from '@/api/reviews'

export type StudyCard = Card & { preview?: RecordLog; state: ReviewState }

type ReviewState = 'failed' | 'passed' | 'unreviewed'

export type StudySessionCore = ReturnType<typeof useStudySessionCore>

/**
 * Mode-agnostic study session core: queue management, FSRS scheduling,
 * session lifecycle, and stats. Does not know about flashcard sides, flipping,
 * or any other interaction model — those live in mode-specific composables.
 *
 * Future study modes (matching pairs, cloze, etc.) build on top of this core.
 */
export function useStudySessionCore(_config?: Partial<DeckConfig>) {
  const _PARAMS = generatorParameters({
    enable_fuzz: true,
    learning_steps: [],
    relearning_steps: []
  })

  const config = reactive<Required<DeckConfig>>({
    study_mode: _config?.study_mode ?? 'flashcard',
    study_all_cards: _config?.study_all_cards ?? false,
    shuffle: _config?.shuffle ?? false,
    card_limit: _config?.card_limit ?? null,
    flip_cards: _config?.flip_cards ?? false,
    is_spaced: _config?.is_spaced ?? true,
    auto_play: _config?.auto_play ?? false
  })

  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)
  const _raw_cards = shallowRef<Card[]>([])
  const _cards_in_deck = shallowRef<StudyCard[]>([])

  const mode = ref<'studying' | 'completed'>('studying')
  const active_card = shallowRef<StudyCard | undefined>(undefined)

  const cards = computed(() => {
    return _cards_in_deck.value
  })

  const num_correct = computed(() => cards.value.filter((c) => c.state === 'passed').length)
  const reviewed_count = computed(() => cards.value.filter((c) => c.state !== 'unreviewed').length)

  const remaining_due_count = computed(() => {
    if (config.study_all_cards) return 0
    const total_due = _raw_cards.value.filter(_isCardDue).length
    return Math.max(0, total_due - reviewed_count.value)
  })

  const current_index = computed(() => {
    if (!active_card.value) return cards.value.length
    return cards.value.findIndex((c) => c.id === active_card.value!.id)
  })

  function setCards(raw: Card[]) {
    _raw_cards.value = raw
    _processCards()
  }

  function updateConfig(updates: Partial<DeckConfig>) {
    config.study_mode = updates.study_mode ?? config.study_mode
    config.study_all_cards = updates.study_all_cards ?? config.study_all_cards
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
    mode.value = 'studying'
    active_card.value = cards.value.find((c) => c.state === 'unreviewed')

    if (!active_card.value) {
      mode.value = 'completed'
    }
  }

  function reviewCard(grade?: Grade) {
    if (!active_card.value) return

    const card = active_card.value

    if (grade !== undefined) {
      // Compute scheduling at the moment the user rates, not at session start.
      // _FSRS_INSTANCE.next() is the single-grade version of repeat() — it
      // returns a fresh RecordLogItem with item.log.review = now and
      // item.card.due calculated from this exact moment.
      const review = card.review ?? (createEmptyCard(new Date()) as Review)
      const item = _FSRS_INSTANCE.next(review, new Date(), grade)

      card.review = item.card
      _markCurrentCardStudied(grade)

      active_card.value = cards.value.find((c) => c.state === 'unreviewed')
      if (!active_card.value) mode.value = 'completed'

      if (card.id) return saveReview(card.id, item.card, item.log)
    } else {
      card.state = 'passed'
      active_card.value = cards.value.find((c) => c.state === 'unreviewed')
      if (!active_card.value) mode.value = 'completed'
    }
  }

  function _setupCard(card: Card): StudyCard {
    const review = card.review ?? (createEmptyCard(new Date()) as Review)
    const preview = _FSRS_INSTANCE.repeat(review, new Date())
    return { state: 'unreviewed', ...card, review, preview }
  }

  function _markCurrentCardStudied(grade: Grade) {
    const card = active_card.value
    if (!card || !card.id) return

    card.state = grade === Rating.Again ? 'failed' : 'passed'
  }

  function _isCardDue(card: Card) {
    if (!card.review?.due) return true
    const raw = card.review.due
    const due = raw instanceof Date ? DateTime.fromJSDate(raw) : DateTime.fromISO(String(raw))
    return due <= DateTime.now()
  }

  return {
    mode,
    active_card,
    cards,
    num_correct,
    reviewed_count,
    remaining_due_count,
    current_index,
    config,
    setCards,
    updateConfig,
    reviewCard
  }
}

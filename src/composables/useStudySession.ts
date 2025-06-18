import { ref } from 'vue'
import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type Card as FSRSCard,
  type RecordLog
} from 'ts-fsrs'

export function useStudySession() {
  const cards = ref<Card[]>([])
  const studiedCardIds = ref<Set<string>>(new Set())
  const failedCardIds = ref<Set<string>>(new Set())
  const lastStudiedCard = ref<Card | undefined>(undefined)
  const activeCard = ref<Card | undefined>(undefined)
  const visibleCard = ref<Card | undefined>(undefined)
  const cardRevealed = ref(false)
  const activeCardOptions = ref<RecordLog | undefined>(undefined)
  const fsrsInstance = ref<FSRS | undefined>(undefined)

  return {
    cards,
    studiedCardIds,
    failedCardIds,
    lastStudiedCard,
    activeCard,
    visibleCard,
    cardRevealed,
    activeCardOptions,
    fsrsInstance
  }
}

import { addMinutes, differenceInHours, formatDistanceToNowStrict } from 'date-fns'
import { minutesInDay } from 'date-fns/constants'

export type SRRating = 0 | 1 | 2 | 3

export interface SRConfig {
  easeMin: number // 1.3
  easeMax: number // 2.65
  easeIncrement: number // Base ease increment on correct answer (default: 0.01)
  easeDecrement: number // Ease decrement on failure (default: 0.05)
  easeBonus: number // Extra ease increment for 'easy' rating (default: 0.05)
  minInterval: number // Minimum interval in minutes (default: 1)
  maxInterval: number // Maximum interval in minutes (default: minutesInYear)
  youngBoundary: number // When a card becomes 'young' (default: minutesInDay)
  matureBoundary: number // When a card becomes 'mature' (default: minutesInDay * 21)
  fuzzFactor: number // Interval fuzzing randomness scale (default: 1)
}

export class SpacedRepetition {
  constructor(public config: SRConfig) {}

  /**
   * Main review function. Returns an object containing the new card values after a review.
   */
  review(card: Card, rating: SRRating): Partial<Card> {
    const now = new Date()
    const ease = this.calculateEase(card, rating)
    const interval = this.calculateInterval(card, rating, ease)
    const due_date = addMinutes(now, interval)
    const state = this.nextState(card.state ?? 'new', rating, interval)

    return {
      ease,
      interval,
      due_date,
      updated_at: now,
      state
    }
  }

  /**
   * Human-friendly preview of interval time.
   */
  formatInterval(intervalMinutes: number): string {
    return formatDistanceToNowStrict(addMinutes(new Date(), intervalMinutes))
  }

  /**
   * Determines if the card was updated in the last 24 hours.
   */
  wasUpdatedToday(updated_at: Date): boolean {
    return differenceInHours(new Date(), updated_at) < 24
  }

  /**
   * Returns preview intervals (in minutes) for each possible rating (0–3),
   * along with the formatted distance string.
   */
  getPreviewIntervals(card: Card): {
    rating: SRRating
    interval: number
    formatted: string
  }[] {
    return [0, 1, 2, 3].map((rating) => {
      const adjustedEase = this.calculateEase(card, rating as SRRating)
      const interval = this.calculateInterval(card, rating as SRRating, adjustedEase)
      return {
        rating: rating as SRRating,
        interval,
        formatted: this.formatInterval(interval)
      }
    })
  }

  /**
   * Computes new ease factor based on review rating.
   */
  private calculateEase(card: Card, rating: SRRating): number {
    const current = card.ease ?? 2.5

    if (rating === 0) {
      // Fail: decrease ease
      return Math.max(current - this.config.easeDecrement, this.config.easeMin)
    } else if (rating === 3) {
      // Easy: extra ease bump
      return Math.min(
        current + this.config.easeIncrement + this.config.easeBonus,
        this.config.easeMax
      )
    } else if (rating === 2) {
      // Good: small ease bump
      return Math.min(current + this.config.easeIncrement, this.config.easeMax)
    } else {
      // Hard: no change
      return current
    }
  }

  /**
   * Computes new interval (in minutes) based on current interval and ease factor.
   */
  private calculateInterval(card: Card, rating: SRRating, ease: number): number {
    const current = card.interval ?? this.config.minInterval
    const fuzz = this.getFuzz(current)

    if (rating === 0) {
      // Fail: reset to a low interval
      return 10
    }

    // Base calculation: ease * interval growth
    let base = current * ease

    if (rating === 1) {
      // Hard: small bump
      base = current + current * 0.15
    } else if (rating === 2) {
      // Good: normal ease factor
      base = current * ease
    } else if (rating === 3) {
      // Easy: bigger boost
      base = current * (ease + 0.15)
    }

    const interval = Math.floor(base + fuzz)
    return Math.min(Math.max(interval, this.config.minInterval), this.config.maxInterval)
  }

  /**
   * Applies interval "fuzz" to prevent rigid schedules and predictability.
   */
  private getFuzz(interval: number): number {
    const MIN_FUZZ = 5
    const MAX_FUZZ = minutesInDay / 2

    const scale = Math.log(interval) / Math.log(MAX_FUZZ)
    const fuzzMagnitude = MIN_FUZZ + (MAX_FUZZ - MIN_FUZZ) * Math.min(1, scale)
    const fuzz = (Math.random() * 2 - 1) * fuzzMagnitude
    return Math.round(fuzz * 100) / 100
  }

  /**
   * Determines the next card state based on its current state, interval, and review rating.
   */
  private nextState(current: CardState, rating: SRRating, interval: number): CardState {
    if (rating === 0) {
      // Fail: send back to relearn if previously promoted
      if (current === 'young' || current === 'mature') return 'relearn'
      return current
    }

    // Promotions
    if (current === 'new') return 'learning'
    if (
      (current === 'learning' || current === 'relearn') &&
      interval >= this.config.youngBoundary &&
      interval < this.config.matureBoundary
    )
      return 'young'
    if ((current === 'young' || current === 'relearn') && interval >= this.config.matureBoundary)
      return 'mature'

    return current
  }
}

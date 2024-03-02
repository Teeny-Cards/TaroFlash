import { differenceInHours, formatDistanceToNowStrict, addMinutes } from 'date-fns'
import { minutesInYear, minutesInDay } from 'date-fns/constants'

interface StreakBonus {
  threshold: number
  bonus: number
  status: streakStatus
}

type streakStatus = 'diamond' | 'gold' | 'silver' | 'bronze' | 'copper' | 'none'

const bonuses: StreakBonus[] = [
  { threshold: 21, bonus: 0.05, status: 'diamond' },
  { threshold: 13, bonus: 0.04, status: 'gold' },
  { threshold: 8, bonus: 0.03, status: 'silver' },
  { threshold: 5, bonus: 0.02, status: 'bronze' },
  { threshold: 3, bonus: 0.01, status: 'copper' }
]

// SRC = Spaced Repetition Card
export default class SRC {
  private readonly EASE_MIN = 1.3
  private readonly EASE_MAX = 2.65
  private readonly EASE_DENOMINATOR = 10
  private readonly EASE_INCREMENT = 0.01
  private readonly EASE_DECREMENT = 0.05
  private readonly MIN_INTERVAL = 1 // 1 minute
  private readonly MAX_INTERVAL = minutesInYear
  private readonly YOUNG_BOUNDARY = minutesInDay
  private readonly MATURE_BOUNDARY = minutesInDay * 21 // 3 weeks
  private readonly FUZZ_FACTOR = 1

  dueDate: Date
  lastUpdated: Date
  state: CardState
  interval: number
  ease: number
  leechCount: number
  streak: number

  constructor(card: Card) {
    this.dueDate = card.dueDate ?? new Date()
    this.lastUpdated = card.lastUpdated ?? new Date()
    this.state = card.state ?? 'new'
    this.interval = card.interval ?? 6
    this.ease = card.ease ?? 2.5
    this.leechCount = card.leechCount ?? 0
    this.streak = card.streak ?? 0
  }

  get passIntervalString(): string {
    return formatDistanceToNowStrict(addMinutes(new Date(), this.passInterval))
  }

  get failIntervalString(): string {
    return formatDistanceToNowStrict(addMinutes(new Date(), this.failInterval))
  }

  get passInterval(): number {
    if (this.state === 'new') {
      return 10
    } else if (this.state === 'learning' && this.interval <= 10) {
      return 10.1
    } else if (this.state === 'learning' && this.interval < minutesInDay) {
      return minutesInDay
    }

    const d = this.interval * (this.ease / this.EASE_DENOMINATOR)
    const interval = Math.floor(this.interval + d + this.fuzz)
    return Math.min(interval, this.MAX_INTERVAL)
  }

  get failInterval(): number {
    if (this.state === 'new') {
      return 6
    } else if (this.state === 'learning' && this.interval <= 6) {
      return 6.1
    } else if (this.state === 'learning' && this.interval < minutesInDay) {
      return 10
    }

    const d = this.interval * (this.ease / this.EASE_DENOMINATOR)
    const interval = Math.floor(this.interval - d)
    return Math.max(interval, this.MIN_INTERVAL)
  }

  get streakBonus(): number {
    return bonuses.find(({ threshold }) => this.streak >= threshold)?.bonus ?? 0
  }

  get streakStatus(): streakStatus {
    return bonuses.find(({ threshold }) => this.streak >= threshold)?.status ?? 'none'
  }

  get updatedToday(): boolean {
    return differenceInHours(new Date(), this.lastUpdated) < 24
  }

  public pass(): void {
    this.streak++
    this.calculateEaseFactor(true)
    this.promoteCard()

    this.interval = this.passInterval
    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + this.interval))
    this.lastUpdated = new Date()
  }

  public fail(): void {
    this.streak = 0
    this.calculateEaseFactor(false)
    this.updateLeechCount()
    this.demoteCard()

    this.interval = this.failInterval
    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + this.interval))
    this.lastUpdated = new Date()
  }

  private calculateEaseFactor(pass: boolean): void {
    if (pass) {
      const ease = Math.round((this.ease + this.EASE_INCREMENT + this.streakBonus) * 100) / 100
      this.ease = Math.min(ease, this.EASE_MAX)
    } else {
      const ease = Math.round((this.ease - this.EASE_DECREMENT) * 100) / 100
      this.ease = Math.max(ease, this.EASE_MIN)
    }
  }

  private promoteCard(): void {
    // if (this.updatedToday) return

    if (this.state === 'new') {
      this.state = 'learning'
    } else if (
      (this.state === 'learning' || this.state === 'relearn') &&
      this.interval >= this.YOUNG_BOUNDARY &&
      this.interval < this.MATURE_BOUNDARY
    ) {
      this.state = 'young'
    } else if (
      (this.state === 'young' || this.state === 'relearn') &&
      this.interval >= this.MATURE_BOUNDARY
    ) {
      this.state = 'mature'
    }
  }

  private demoteCard(): void {
    // if (this.updatedToday) return

    if (this.state === 'mature' || this.state === 'young') {
      this.state = 'relearn'
    }
  }

  private updateLeechCount(): void {
    if (this.state === 'mature' || this.state === 'young') {
      this.leechCount++
    }
  }

  get fuzzString(): string {
    const fuzz = this.fuzz
    const sign = Math.sign(fuzz) >= 0 ? '+' : '-'
    const absoluteFuzz = Math.abs(fuzz)
    const timeDistance = formatDistanceToNowStrict(addMinutes(new Date(), absoluteFuzz))

    return `${sign}${timeDistance}`
  }

  get fuzz(): number {
    const MIN_FUZZ = 5
    const MAX_FUZZ = minutesInDay / 2

    const scale = Math.log(this.interval) / Math.log(MAX_FUZZ)
    const fuzzMagnitude = MIN_FUZZ + (MAX_FUZZ - MIN_FUZZ) * Math.min(1, scale)
    const fuzz = (Math.random() * 2 - 1) * fuzzMagnitude
    const clampedFuzz = Math.max(-MAX_FUZZ, Math.min(MAX_FUZZ, fuzz))

    return Math.round(clampedFuzz * 100) / 100
  }
}

/*
  Learning Steps

  When you first see a card, it is in the learning phase.
  During this phase, the card will be shown at increasingly long intervals.
  The first time you see a card, it will be shown to you again after a short delay.
  If you answer the card correctly, it will be longer before the cared is shown to you gain .
  If you answer the card incorrectly, it will be shown again to you sooner

  New:
    - 1 minute
    - 10 minutes

  Learning (first day):
    - 10 minutes
    - 1 day

  Learning (subsequent day):
    - 10 minutes
    - 1 day

  Once a learning card passes the final learning step, it becomes a review card.
  The card will be shown to you again the next day, then at increasingly long intervals.

  Review: 
    - 50% of the previous interval
    - interval * ease factor

  When you forget a review card, it must be relearnt.
  The default behaviour for lapsed reviews is to reset the interval to 1 (i.e. make it due tomorrow),
  and put it in the learning queue for a refresher in 10 minutes.
*/

/*
  Falling Behind

  If you fall behind in your reviews, cards that have been waiting the longest will be prioritized.
  This is done by taking the cards that have been waiting the longest and showing them to you in a random order up until your daily review limit.
  This ordering ensures that no cards will be left waiting indefinitely,
  but it means that if you introduce new cards, their reviews won’t appear until you’ve gotten through your backlog.

  When you answer cards that have been waiting for a while, that delay will be factored in when determining the next time a card should be shown.
*/

/*
  Deck Configuration Options:

  New cards per day: 20
  Maximum reviews per day: 200
  auto play audio: true
*/

import { differenceInHours } from 'date-fns'

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

export class SRS {
  private readonly EASE_MIN = 1.3
  private readonly EASE_MAX = 2.65
  private readonly EASE_INCREMENT = 0.01
  private readonly EASE_DECREMENT = 0.05
  private readonly FAIL_DECREMENT = 0.5
  private readonly MIN_INTERVAL = 0.00069 // 1 minute
  private readonly MAX_INTERVAL = 365 // 1 year
  private readonly YOUNG_BOUNDARY = 1
  private readonly MATURE_BOUNDARY = 21
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
    this.state = card.state ?? 'learning'
    this.interval = card.interval ?? 0
    this.ease = card.ease ?? 2.5
    this.leechCount = card.leechCount ?? 0
    this.streak = card.streak ?? 0
  }

  get passInterval(): number {
    switch (this.state) {
      case 'new':
        return 0.00345 + this.smallFuzz // 5 minutes ± fuzz
      case 'learning':
        return 1
    }

    const interval = Math.floor(this.interval * this.ease) * this.fuzz
    return Math.min(interval, this.MAX_INTERVAL)
  }

  get failInterval(): number {
    if (this.state === 'new') {
      return this.MIN_INTERVAL
    } else if (this.state === 'learning') {
      return 0.00345 + this.smallFuzz // 5 minutes ± fuzz
    }

    const interval = Math.floor(this.interval * this.FAIL_DECREMENT) * this.fuzz
    return Math.max(interval, this.MIN_INTERVAL)
  }

  get streakBonus(): number {
    return bonuses.find(({ threshold }) => this.streak >= threshold)?.bonus ?? 0
  }

  get streakStatus(): streakStatus {
    return bonuses.find(({ threshold }) => this.streak >= threshold)?.status ?? 'none'
  }

  get fuzz(): number {
    const min = -2 * this.FUZZ_FACTOR // -3 days * fuzz
    const max = 2 * this.FUZZ_FACTOR // 3 days * fuzz

    const fuzz = Math.random() * (max - min) + min
    return Math.floor(fuzz)
  }

  get smallFuzz(): number {
    const min = -0.00345 // -5mins
    const max = 0.00345 // 5mins

    const fuzz = Math.random() * (max - min) + min
    return Math.floor(fuzz)
  }

  get updatedToday(): boolean {
    return differenceInHours(new Date(), this.lastUpdated) < 24
  }

  public pass(): void {
    this.calculateEaseFactor(true)
    this.promoteCard()

    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + this.passInterval))
    this.interval = this.passInterval
    this.lastUpdated = new Date()
  }

  public fail(): void {
    this.calculateEaseFactor(false)
    this.demoteCard()
    this.updateLeechCount()

    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + this.failInterval))
    this.interval = this.failInterval
    this.lastUpdated = new Date()
  }

  private calculateEaseFactor(pass: boolean): void {
    if (pass) {
      const ease = this.ease + this.EASE_INCREMENT + this.streakBonus
      this.ease = Math.min(ease, this.EASE_MAX)
    } else {
      const ease = this.ease - this.EASE_DECREMENT
      this.ease = Math.max(ease, this.EASE_MIN)
    }
  }

  private promoteCard(): void {
    if (this.updatedToday) return

    if (this.state === 'new') {
      this.state = 'learning'
    } else if (
      (this.state === 'learning' || this.state === 'relearn') &&
      this.interval >= this.YOUNG_BOUNDARY
    ) {
      this.state = 'young'
    } else if (
      (this.state === 'young' || this.state === 'relearn') &&
      this.interval >= this.MATURE_BOUNDARY
    ) {
      this.state = 'mature'
    }
  }

  demoteCard(): void {
    if (this.updatedToday) return

    if (this.state === 'mature' || this.state === 'young') {
      this.state = 'relearn'
    }
  }

  updateLeechCount(): void {
    if (this.state === 'mature' || this.state === 'young') {
      this.leechCount++
    }
  }
}

/*
  Card States

  new - has never been studied
  learning - studied but has an interval of <= 1 and lastUpdated is within 24 hours
  review
     young - interval < 21 days but not learning
     mature - interval > 21 days
  relearn - failed a mature card
*/

/*
  Learning Steps

  When you first see a card, it is in the learning phase. During this phase, the card will be shown at increasingly long intervals. The first time you see a card, it will be shown to you again after a short delay. If you answer the card correctly, it will be longer before the cared is shown to you gain . If you answer the card incorrectly, it will be shown again to you sooner

  New:
    - 1 minute
    - 10 minutes

  Learning (first day):
    - 10 minutes
    - 1 day

  If you answer a card incorrectly, The card will be shown again based on the card's ease, which is a number between 130% and 250%. When you answer a card, the card’s next interval will be determined by multiplying the card’s current interval by the ease.

  Learning (subsequent days):
    - 10 minutes
    - 1 day

  Once a learning card passes the final learning step, it becomes a review card. The card will be shown to you again the next day, then at increasingly long intervals.

  Review: 
    - 50% of the previous interval
    - interval * ease factor

  When you forget a review card, it must be relearnt. The default behaviour for lapsed reviews is to reset the interval to 1 (i.e. make it due tomorrow), and put it in the learning queue for a refresher in 10 minutes.
*/

/*
  Calculating Ease Factor

  - all new cards start with an ease factor of 250% by default
  - when you answer a card correctly, the ease factor is incremented by 1%
  - when you answer a card incorrectly, the ease factor is decremented by 5%
  - the ease factor is capped at 130% and 265%
  - a streak of correct answers will increase the increment variable at a rate equal to the fibonacci sequence, it will increase by the index of the sequence starting at 3. Maximum of +5%
    - ex: streak of 3 = +1%, streak of 5 = +2%, streak of 8 = +3%, etc.
*/

/*
  Fuzz Factor

  When you select an ease button on a review card, a small amount of random “fuzz” will be applied to prevent cards that were introduced at the same time and given the same ratings from sticking together and always coming up for review on the same day.

  Fuzz will be a random interval of up to ±3 minutes
  Learning cards are also given up to ±5 minutes of extra delay so that they don’t always appear in the same order.
*/

/*
  Falling Behind

  If you fall behind in your reviews, cards that have been waiting the longest will be prioritized. This is done by taking the cards that have been waiting the longest and showing them to you in a random order up until your daily review limit. This ordering ensures that no cards will be left waiting indefinitely, but it means that if you introduce new cards, their reviews won’t appear until you’ve gotten through your backlog.

  When you answer cards that have been waiting for a while, that delay will be factored in when determining the next time a card should be shown.
*/

/*
  Leeches

  Each time a review card fails while it is in review mode, a counter increases. When this counter reaches 8, the card will be tagged as a leech.
*/

/*
  Deck Configuration Options:

  New cards per day: 20
  Maximum reviews per day: 200
  maximum interval: 365
  leech threshold: 8
  auto delete leeches: false
  auto play audio: true
  starting ease: 2.5
  new cards ignore review limit: false
  review order: random
  streak bonus: true
*/

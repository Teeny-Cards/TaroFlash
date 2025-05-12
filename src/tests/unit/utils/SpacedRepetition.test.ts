import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SpacedRepetition, type SRConfig, type SRRating } from '@/utils/SpacedRepetition'
import { subHours } from 'date-fns'
import { minutesInDay } from 'date-fns/constants'

describe('SpacedRepetition', () => {
  // Default test configuration
  const defaultConfig: SRConfig = {
    easeMin: 1.3,
    easeMax: 2.65,
    easeIncrement: 0.01,
    easeDecrement: 0.05,
    easeBonus: 0.05,
    minInterval: 1,
    maxInterval: minutesInDay * 365, // roughly a year in minutes
    youngBoundary: minutesInDay,
    matureBoundary: minutesInDay * 21,
    fuzzFactor: 1
  }

  const createCard = (overrides = {}): Card => ({
    front_text: 'Test front',
    back_text: 'Test back',
    id: '1',
    ease: 2.5,
    interval: 60, // 1 hour in minutes
    state: 'learning',
    ...overrides
  })

  // Mock the random function to make tests deterministic
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('constructor', () => {
    it('should initialize with the provided config', () => {
      const sr = new SpacedRepetition(defaultConfig)
      expect(sr.config).toEqual(defaultConfig)
    })
  })

  describe('review', () => {
    it('should return updated card properties after a review', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const result = sr.review(card, 2) // Good rating

      expect(result).toHaveProperty('ease')
      expect(result).toHaveProperty('interval')
      expect(result).toHaveProperty('due_date')
      expect(result).toHaveProperty('updated_at')
      expect(result).toHaveProperty('state')
    })

    it('should handle a new card with no previous values', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const newCard: Card = {
        front_text: 'New card',
        back_text: 'New card back'
      }

      const result = sr.review(newCard, 2) // Good rating

      expect(result.ease).toBeCloseTo(2.51) // 2.5 (default) + 0.01 (increment)
      expect(result.interval).toBeGreaterThan(0)
      expect(result.state).toBe('learning') // New cards become learning
    })

    it('should handle a failed review (rating 0)', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({ state: 'young' })
      const result = sr.review(card, 0) // Failed rating

      expect(result.ease).toBeCloseTo(2.45) // 2.5 - 0.05 (decrement)
      expect(result.interval).toBe(10) // Reset to 10 minutes
      expect(result.state).toBe('relearn') // Young cards go to relearn on failure
    })

    it('should handle a hard review (rating 1)', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const result = sr.review(card, 1) // Hard rating

      // Ease should remain the same for hard ratings
      expect(result.ease).toBeCloseTo(2.5)

      // Interval should increase by 15%
      expect(result.interval).toBeGreaterThan(card.interval!)

      // State should remain learning if interval is below youngBoundary
      expect(result.state).toBe('learning')
    })

    it('should handle a good review (rating 2)', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const result = sr.review(card, 2) // Good rating

      // Ease should increase by easeIncrement
      expect(result.ease).toBeCloseTo(2.51)

      // Interval should increase by ease factor
      expect(result.interval).toBeGreaterThan(card.interval!)

      // State should remain learning if interval is below youngBoundary
      expect(result.state).toBe('learning')
    })

    it('should handle an easy review (rating 3)', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const result = sr.review(card, 3) // Easy rating

      // Ease should increase by easeIncrement + easeBonus
      expect(result.ease).toBeCloseTo(2.56)

      // Interval should increase more than with a "good" rating
      expect(result.interval).toBeGreaterThan(card.interval!)

      // State should remain learning if interval is below youngBoundary
      expect(result.state).toBe('learning')
    })

    it('should promote cards to young when interval reaches youngBoundary', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({
        interval: minutesInDay - 100, // Just below the boundary
        state: 'learning'
      })

      // Use a high rating to ensure promotion
      const result = sr.review(card, 3)

      // Interval should now be above youngBoundary
      expect(result.interval).toBeGreaterThanOrEqual(minutesInDay)

      // State should be promoted to young
      expect(result.state).toBe('young')
    })

    it('should promote cards to mature when interval reaches matureBoundary', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({
        interval: minutesInDay * 21 - 100, // Just below the mature boundary
        state: 'young'
      })

      // Use a high rating to ensure promotion
      const result = sr.review(card, 3)

      // Interval should now be above matureBoundary
      expect(result.interval).toBeGreaterThanOrEqual(minutesInDay * 21)

      // State should be promoted to mature
      expect(result.state).toBe('mature')
    })
  })

  describe('formatInterval', () => {
    it('should format interval in minutes to human-readable string', () => {
      const sr = new SpacedRepetition(defaultConfig)

      // Test various intervals
      expect(sr.formatInterval(30)).toBe('30 minutes')
      expect(sr.formatInterval(60)).toBe('1 hour')
      expect(sr.formatInterval(minutesInDay)).toBe('1 day')
      expect(sr.formatInterval(minutesInDay * 7)).toBe('7 days')
    })
  })

  describe('wasUpdatedToday', () => {
    it('should return true if card was updated less than 24 hours ago', () => {
      const sr = new SpacedRepetition(defaultConfig)

      // Card updated 12 hours ago
      const updated12HoursAgo = subHours(new Date(), 12)
      expect(sr.wasUpdatedToday(updated12HoursAgo)).toBe(true)

      // Card updated 23 hours ago
      const updated23HoursAgo = subHours(new Date(), 23)
      expect(sr.wasUpdatedToday(updated23HoursAgo)).toBe(true)
    })

    it('should return false if card was updated more than 24 hours ago', () => {
      const sr = new SpacedRepetition(defaultConfig)

      // Card updated 25 hours ago
      const updated25HoursAgo = subHours(new Date(), 25)
      expect(sr.wasUpdatedToday(updated25HoursAgo)).toBe(false)
    })
  })

  describe('getPreviewIntervals', () => {
    it('should return preview intervals for all possible ratings', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()

      const previews = sr.getPreviewIntervals(card)

      // Should return 4 previews (one for each rating 0-3)
      expect(previews).toHaveLength(4)

      // Each preview should have rating, interval, and formatted properties
      previews.forEach((preview, index) => {
        expect(preview).toHaveProperty('rating', index as SRRating)
        expect(preview).toHaveProperty('interval')
        expect(preview).toHaveProperty('formatted')
      })

      // Rating 0 (fail) should have the lowest interval
      expect(previews[0].interval).toBe(10)

      // Ratings should have increasing intervals
      expect(previews[1].interval).toBeGreaterThan(previews[0].interval)
      expect(previews[2].interval).toBeGreaterThan(previews[1].interval)
      expect(previews[3].interval).toBeGreaterThan(previews[2].interval)
    })
  })

  describe('edge cases', () => {
    it('should respect minimum ease value', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({ ease: defaultConfig.easeMin }) // Already at minimum

      const result = sr.review(card, 0) // Failed rating

      // Ease should not go below minimum
      expect(result.ease).toBe(defaultConfig.easeMin)
    })

    it('should respect maximum ease value', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({ ease: defaultConfig.easeMax }) // Already at maximum

      const result = sr.review(card, 3) // Easy rating

      // Ease should not go above maximum
      expect(result.ease).toBe(defaultConfig.easeMax)
    })

    it('should respect minimum interval value', () => {
      const sr = new SpacedRepetition(defaultConfig)
      // Use a small but valid interval (not 0, which might cause calculation issues)
      const card = createCard({ interval: 1 })

      // Even with a low ease, interval should not go below minimum
      const result = sr.review(card, 1) // Hard rating

      expect(result.interval).toBeGreaterThanOrEqual(defaultConfig.minInterval)
    })

    it('should respect maximum interval value', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({
        interval: defaultConfig.maxInterval - 1000,
        ease: defaultConfig.easeMax // High ease to ensure we hit the max
      })

      const result = sr.review(card, 3) // Easy rating

      // Interval should not go above maximum
      expect(result.interval).toBeLessThanOrEqual(defaultConfig.maxInterval)
    })

    it('should handle relearn state correctly', () => {
      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard({ state: 'relearn' })

      // A good rating should promote from relearn to young if interval is high enough
      const result = sr.review(card, 2)

      if (result.interval! >= defaultConfig.youngBoundary) {
        expect(result.state).toBe('young')
      } else {
        expect(result.state).toBe('relearn')
      }

      // A relearn card with a high interval should promote to mature
      const matureCard = createCard({
        state: 'relearn',
        interval: defaultConfig.matureBoundary - 100 // Just below mature boundary
      })

      const matureResult = sr.review(matureCard, 3) // Easy rating to ensure promotion

      expect(matureResult.interval).toBeGreaterThanOrEqual(defaultConfig.matureBoundary)
      expect(matureResult.state).toBe('mature')
    })
  })

  describe('fuzz factor', () => {
    it('should apply positive fuzz when random is > 0.5', () => {
      // Mock random to return a value > 0.5 to get positive fuzz
      vi.spyOn(Math, 'random').mockReturnValue(0.75)

      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const baseInterval = card.interval! * card.ease!

      const result = sr.review(card, 2) // Good rating

      // With positive fuzz, the interval should be greater than the base calculation
      expect(result.interval).toBeGreaterThan(baseInterval)
    })

    it('should apply negative fuzz when random is < 0.5', () => {
      // Mock random to return a value < 0.5 to get negative fuzz
      vi.spyOn(Math, 'random').mockReturnValue(0.25)

      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const baseInterval = card.interval! * card.ease!

      const result = sr.review(card, 2) // Good rating

      // With negative fuzz, the interval should be less than the base calculation
      expect(result.interval).toBeLessThan(baseInterval)
    })

    it('should apply no fuzz when random is exactly 0.5', () => {
      // Mock random to return exactly 0.5 for zero fuzz
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const sr = new SpacedRepetition(defaultConfig)
      const card = createCard()
      const baseInterval = Math.floor(card.interval! * card.ease!)

      const result = sr.review(card, 2) // Good rating

      // With zero fuzz, the interval should be equal to the base calculation
      expect(result.interval).toBe(baseInterval)
    })
  })
})

import { describe, test, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import {
  randomCoverConfig,
  SUPPORTED_THEMES,
  SUPPORTED_PATTERNS,
  SUPPORTED_ICONS
} from '@/utils/cover'

describe('randomCoverConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('returns a config whose fields are drawn from SUPPORTED_* lists', () => {
    const config = randomCoverConfig()

    expect(SUPPORTED_THEMES.map((t) => t.light)).toContain(config.theme)
    expect(SUPPORTED_PATTERNS).toContain(config.pattern)
    expect(SUPPORTED_ICONS).toContain(config.icon)
  })

  test('pairs theme_dark with the same theme entry whose light matches', () => {
    // Force the first option so the pairing is deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const config = randomCoverConfig()
    const matching = SUPPORTED_THEMES.find((t) => t.light === config.theme)
    expect(config.theme_dark).toBe(matching.dark)
  })

  test('picks the last element when Math.random returns just under 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    const config = randomCoverConfig()

    const lastTheme = SUPPORTED_THEMES[SUPPORTED_THEMES.length - 1]
    expect(config.theme).toBe(lastTheme.light)
    expect(config.pattern).toBe(SUPPORTED_PATTERNS[SUPPORTED_PATTERNS.length - 1])
    expect(config.icon).toBe(SUPPORTED_ICONS[SUPPORTED_ICONS.length - 1])
  })
})

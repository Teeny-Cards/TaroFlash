import { describe, test, expect } from 'vite-plus/test'
import { bgxClasses, BGX_PATTERN_CLASS, BGX_SIZE_CLASS } from '@/utils/bgx'

describe('BGX_PATTERN_CLASS', () => {
  test('maps every DeckCoverPattern to a bgx- class string', () => {
    const patterns = [
      'diagonal-stripes',
      'saw',
      'wave',
      'bank-note',
      'aztec',
      'endless-clouds',
      'stars',
      'leaf',
      'dot-grid'
    ]

    for (const p of patterns) {
      expect(BGX_PATTERN_CLASS[p]).toBe(`bgx-${p}`)
    }
  })
})

describe('BGX_SIZE_CLASS', () => {
  test('maps every defined size to a bgx-size- class string', () => {
    const sizes = [10, 12, 15, 20, 25, 30]

    for (const s of sizes) {
      expect(BGX_SIZE_CLASS[s]).toBe(`bgx-size-${s}`)
    }
  })
})

describe('bgxClasses', () => {
  test('returns empty array when called with no argument', () => {
    expect(bgxClasses()).toEqual([])
  })

  test('returns empty array when called with empty config', () => {
    expect(bgxClasses({})).toEqual([])
  })

  test('returns pattern class when only pattern is set', () => {
    expect(bgxClasses({ pattern: 'wave' })).toEqual(['bgx-wave'])
  })

  test('returns size class when only a known size is set', () => {
    expect(bgxClasses({ size: 20 })).toEqual(['bgx-size-20'])
  })

  test('returns both pattern and size classes when both are set', () => {
    const result = bgxClasses({ pattern: 'aztec', size: 15 })
    expect(result).toEqual(['bgx-aztec', 'bgx-size-15'])
  })

  test('omits size class when size is not in the size map', () => {
    const result = bgxClasses({ pattern: 'stars', size: 99 })
    expect(result).toEqual(['bgx-stars'])
  })

  test('returns empty array when size is not in map and no pattern', () => {
    expect(bgxClasses({ size: 99 })).toEqual([])
  })
})

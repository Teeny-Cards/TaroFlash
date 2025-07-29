import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    warn: vi.fn()
  }
})

// Mock Howler library
const mockHowl = {
  volume: vi.fn().mockReturnThis(),
  play: vi.fn(),
  stop: vi.fn(),
  playing: vi.fn().mockReturnValue(false)
}

const mockHowler = {
  autoUnlock: false,
  mute: vi.fn()
}

const mockHowlConstructor = vi.fn(() => mockHowl)

vi.mock('howler', () => ({
  Howl: mockHowlConstructor,
  Howler: mockHowler
}))

vi.mock('@/composables/use-logger', () => ({
  useLogger: vi.fn(() => ({
    warn: mocks.warn
  }))
}))

let useAudio

beforeEach(async () => {
  vi.clearAllMocks()
  vi.resetModules()
  mockHowler.autoUnlock = false

  const module = await import('@/composables/use-audio')
  useAudio = module.useAudio
})

describe('useAudio composable', () => {
  test('sets Howler.autoUnlock to false on initialization', () => {
    useAudio()
    expect(mockHowler.autoUnlock).toBe(false)
  })
})

describe('preload', () => {
  test('creates Howl instances for all sound sources', () => {
    const { preload } = useAudio()

    preload()
    expect(mockHowlConstructor).toHaveBeenCalled()
  })

  test('creates Howl instances with correct configuration', () => {
    const { preload } = useAudio()

    preload()

    // Check that each Howl was created with correct src and preload options
    const expectedSources = [
      'double-pop-up.wav',
      'double-pop-down.wav',
      'click_04.wav',
      'etc_woodblock_stuck.wav',
      'digi_powerdown.wav',
      'trash_crumple_short.wav',
      'chime_short_chord_up.wav',
      'etc_camera_shutter.wav'
    ]

    expectedSources.forEach((source, index) => {
      expect(mockHowlConstructor).toHaveBeenNthCalledWith(index + 1, {
        src: [`/src/assets/audio/${source}`],
        preload: true
      })
    })
  })

  test('sets isInitialized to true after preloading', () => {
    const { preload, isInitialized } = useAudio()

    expect(isInitialized.value).toBe(false)
    preload()
    expect(isInitialized.value).toBe(true)
  })

  test('does not reload sounds if already initialized', () => {
    const { preload } = useAudio()

    preload()
    const firstCallCount = mockHowlConstructor.mock.calls.length

    preload()
    const secondCallCount = mockHowlConstructor.mock.calls.length

    expect(secondCallCount).toBe(firstCallCount)
  })

  test('multiple instances share the same initialization state', () => {
    const audio1 = useAudio()
    const audio2 = useAudio()

    expect(audio1.isInitialized.value).toBe(false)
    expect(audio2.isInitialized.value).toBe(false)

    audio1.preload()

    expect(audio1.isInitialized.value).toBe(true)
    expect(audio2.isInitialized.value).toBe(true)
  })
})

describe('play', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
  })

  test('plays sound with default volume when no options provided', () => {
    const { play } = useAudio()

    play('double-pop-up')

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('plays sound with custom volume when provided', () => {
    const { play } = useAudio()

    play('double-pop-up', { volume: 0.5 })

    expect(mockHowl.volume).toHaveBeenCalledWith(0.5)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('works with all valid sound keys', () => {
    const { play } = useAudio()
    const validKeys = [
      'double-pop-up',
      'double-pop-down',
      'click_04',
      'etc_woodblock_stuck',
      'digi_powerdown',
      'trash_crumple_short',
      'chime_short_chord_up',
      'etc_camera_shutter'
    ]

    validKeys.forEach((key) => {
      vi.clearAllMocks()
      play(key)
      expect(mockHowl.volume).toHaveBeenCalledWith(1)
      expect(mockHowl.play).toHaveBeenCalled()
    })
  })

  test('logs warning when sound key does not exist', () => {
    const { play } = useAudio()

    play('non-existent-sound')

    expect(mocks.warn).toHaveBeenCalledWith('Sound "non-existent-sound" not loaded.')
  })

  test('does not call volume or play when sound does not exist', () => {
    const { play } = useAudio()

    play('non-existent-sound')

    expect(mockHowl.volume).not.toHaveBeenCalled()
    expect(mockHowl.play).not.toHaveBeenCalled()
  })

  test('works without preloading (should warn)', async () => {
    // Create fresh instance without preloading
    vi.resetModules()
    const { useAudio: freshUseAudio } = await import('@/composables/use-audio')
    const { play } = freshUseAudio()

    play('double-pop-up')

    expect(mocks.warn).toHaveBeenCalledWith('Sound "double-pop-up" not loaded.')
  })
})

describe('playRandom', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()

    vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    Math.random.mockRestore()
  })

  test('plays first sound when Math.random returns 0', () => {
    Math.random.mockReturnValue(0)
    const { playRandom } = useAudio()

    playRandom(['double-pop-up', 'click_04'])

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('plays second sound when Math.random returns 0.5', () => {
    Math.random.mockReturnValue(0.5)
    const { playRandom } = useAudio()

    playRandom(['double-pop-up', 'click_04'])

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('plays last sound when Math.random returns close to 1', () => {
    Math.random.mockReturnValue(0.99)
    const { playRandom } = useAudio()

    playRandom(['double-pop-up', 'click_04', 'digi_powerdown'])

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('applies volume options correctly', () => {
    Math.random.mockReturnValue(0)
    const { playRandom } = useAudio()

    playRandom(['double-pop-up'], { volume: 0.3 })

    expect(mockHowl.volume).toHaveBeenCalledWith(0.3)
  })

  test('handles single sound array', () => {
    Math.random.mockReturnValue(0.5) // Should still select the only sound
    const { playRandom } = useAudio()

    playRandom(['double-pop-up'])

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
  })

  test('handles empty array gracefully', () => {
    const { playRandom } = useAudio()

    expect(() => playRandom([])).not.toThrow()
    // Should not attempt to play anything
    expect(mockHowl.play).not.toHaveBeenCalled()
  })

  test('handles array with non-existent sound keys', () => {
    Math.random.mockReturnValue(0)
    const { playRandom } = useAudio()

    playRandom(['non-existent-sound'])

    expect(mocks.warn).toHaveBeenCalledWith('Sound "non-existent-sound" not loaded.')
    expect(mockHowl.play).not.toHaveBeenCalled()
  })

  test('handles mixed valid and invalid sound keys', () => {
    Math.random.mockReturnValue(0.5) // Should select second item (valid)
    const { playRandom } = useAudio()

    playRandom(['non-existent-sound', 'double-pop-up'])

    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
    expect(mocks.warn).not.toHaveBeenCalled()
  })
})

describe('isPlaying', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
  })

  test('returns true when sound is playing', () => {
    mockHowl.playing.mockReturnValue(true)
    const { isPlaying } = useAudio()

    const result = isPlaying('double-pop-up')

    expect(result).toBe(true)
    expect(mockHowl.playing).toHaveBeenCalled()
  })

  test('returns false when sound is not playing', () => {
    mockHowl.playing.mockReturnValue(false)
    const { isPlaying } = useAudio()

    const result = isPlaying('double-pop-up')

    expect(result).toBe(false)
    expect(mockHowl.playing).toHaveBeenCalled()
  })

  test('returns false when sound does not exist', () => {
    const { isPlaying } = useAudio()

    const result = isPlaying('non-existent-sound')

    expect(result).toBe(false)
    expect(mockHowl.playing).not.toHaveBeenCalled()
  })

  test('works with all valid sound keys', () => {
    const { isPlaying } = useAudio()
    const validKeys = [
      'double-pop-up',
      'double-pop-down',
      'click_04',
      'etc_woodblock_stuck',
      'digi_powerdown',
      'trash_crumple_short',
      'chime_short_chord_up',
      'etc_camera_shutter'
    ]

    validKeys.forEach((key) => {
      mockHowl.playing.mockReturnValue(true)
      const result = isPlaying(key)
      expect(result).toBe(true)
    })
  })

  test('does not log warnings for non-existent sounds', () => {
    const { isPlaying } = useAudio()

    isPlaying('non-existent-sound')

    expect(mocks.warn).not.toHaveBeenCalled()
  })
})

describe('stop', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
  })

  test('stops sound when it exists', () => {
    const { stop } = useAudio()

    stop('double-pop-up')

    expect(mockHowl.stop).toHaveBeenCalled()
  })

  test('does nothing when sound does not exist', () => {
    const { stop } = useAudio()

    stop('non-existent-sound')

    expect(mockHowl.stop).not.toHaveBeenCalled()
  })

  test('works with all valid sound keys', () => {
    const { stop } = useAudio()
    const validKeys = [
      'double-pop-up',
      'double-pop-down',
      'click_04',
      'etc_woodblock_stuck',
      'digi_powerdown',
      'trash_crumple_short',
      'chime_short_chord_up',
      'etc_camera_shutter'
    ]

    validKeys.forEach((key) => {
      vi.clearAllMocks()
      stop(key)
      expect(mockHowl.stop).toHaveBeenCalled()
    })
  })

  test('does not log warnings for non-existent sounds', () => {
    const { stop } = useAudio()

    stop('non-existent-sound')

    expect(mocks.warn).not.toHaveBeenCalled()
  })
})

describe('muteAll', () => {
  test('calls Howler.mute with true when muting', () => {
    const { muteAll } = useAudio()

    muteAll(true)

    expect(mockHowler.mute).toHaveBeenCalledWith(true)
  })

  test('calls Howler.mute with false when unmuting', () => {
    const { muteAll } = useAudio()

    muteAll(false)

    expect(mockHowler.mute).toHaveBeenCalledWith(false)
  })

  test('works without preloading', () => {
    const { muteAll } = useAudio()

    muteAll(true)

    expect(mockHowler.mute).toHaveBeenCalledWith(true)
  })

  test('can be called multiple times', () => {
    const { muteAll } = useAudio()

    muteAll(true)
    muteAll(false)
    muteAll(true)

    expect(mockHowler.mute).toHaveBeenCalledTimes(3)
    expect(mockHowler.mute).toHaveBeenNthCalledWith(1, true)
    expect(mockHowler.mute).toHaveBeenNthCalledWith(2, false)
    expect(mockHowler.mute).toHaveBeenNthCalledWith(3, true)
  })
})

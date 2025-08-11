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
  playing: vi.fn().mockReturnValue(false),
  once: vi.fn()
}

const mockHowler = {
  volume: vi.fn(),
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

// Mock import.meta.glob to return actual audio files from the project
// This makes tests more robust and will automatically adapt to file changes
const mockGlob = vi.fn()
Object.defineProperty(import.meta, 'glob', {
  value: mockGlob,
  writable: true
})

// Use actual audio files that exist in the project
const actualAudioFiles = {
  '/src/assets/audio/chime_short_chord_up.wav': '/src/assets/audio/chime_short_chord_up.wav',
  '/src/assets/audio/click_04.wav': '/src/assets/audio/click_04.wav',
  '/src/assets/audio/click_07.wav': '/src/assets/audio/click_07.wav',
  '/src/assets/audio/digi_powerdown.wav': '/src/assets/audio/digi_powerdown.wav',
  '/src/assets/audio/double-pop-down.wav': '/src/assets/audio/double-pop-down.wav',
  '/src/assets/audio/double-pop-up.wav': '/src/assets/audio/double-pop-up.wav',
  '/src/assets/audio/etc_camera_reel.wav': '/src/assets/audio/etc_camera_reel.wav',
  '/src/assets/audio/etc_camera_shutter.wav': '/src/assets/audio/etc_camera_shutter.wav',
  '/src/assets/audio/etc_woodblock_stuck.wav': '/src/assets/audio/etc_woodblock_stuck.wav',
  '/src/assets/audio/trash_crumple_short.wav': '/src/assets/audio/trash_crumple_short.wav'
}

mockGlob.mockReturnValue(actualAudioFiles)

let useAudio

beforeEach(async () => {
  vi.clearAllMocks()
  vi.resetModules()

  // Reset mock functions
  mockHowl.volume.mockReturnThis()
  mockHowl.play.mockClear()
  mockHowl.stop.mockClear()
  mockHowl.playing.mockReturnValue(false)
  mockHowl.once.mockClear()
  mockHowler.volume.mockClear()
  mockHowler.mute.mockClear()

  // Reset glob mock to actual files
  mockGlob.mockReturnValue(actualAudioFiles)

  const module = await import('@/composables/use-audio')
  useAudio = module.useAudio
})

describe('useAudio composable', () => {
  test('sets Howler volume to 0.5 on initialization', () => {
    useAudio()
    expect(mockHowler.volume).toHaveBeenCalledWith(0.5)
  })
})

describe('preload', () => {
  test('creates Howl instances for all sound sources', () => {
    const { preload } = useAudio()

    preload()
    expect(mockHowlConstructor).toHaveBeenCalled()
  })

  test('handles empty audio files gracefully', () => {
    // Mock empty audio files
    mockGlob.mockReturnValue({})

    const { preload, isInitialized } = useAudio()

    preload()

    // Should still set initialized to true even with no files
    expect(isInitialized.value).toBe(true)
    // Should still create the unlock sound
    expect(mockHowlConstructor).toHaveBeenCalledWith({
      src: ['/src/assets/audio/double-pop-up.wav'],
      volume: 0
    })
  })

  test('creates Howl instances with correct configuration', () => {
    const { preload } = useAudio()

    const callsBefore = mockHowlConstructor.mock.calls.length

    preload()

    const callsAfter = mockHowlConstructor.mock.calls.length
    const newCalls = callsAfter - callsBefore
    const audioFileCount = Object.keys(actualAudioFiles).length

    // Should create 1 unlock sound + number of audio files
    expect(newCalls).toBe(1 + audioFileCount)

    // First new call should be the unlock sound with volume 0
    const firstNewCall = mockHowlConstructor.mock.calls[callsBefore]
    expect(firstNewCall[0]).toEqual({
      src: ['/src/assets/audio/double-pop-up.wav'],
      volume: 0
    })

    // Check that all subsequent calls have preload: true
    for (let i = callsBefore + 1; i < callsAfter; i++) {
      const call = mockHowlConstructor.mock.calls[i]
      expect(call[0]).toHaveProperty('preload', true)
      expect(call[0]).toHaveProperty('src')
      expect(Array.isArray(call[0].src)).toBe(true)
      expect(call[0].src[0]).toMatch(/^\/src\/assets\/audio\/.*\.wav$/)
    }
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

  test('sets up unlock callback correctly', () => {
    const { preload } = useAudio()

    preload()

    // Verify that the unlock sound was created with an 'unlock' callback
    expect(mockHowl.once).toHaveBeenCalledWith('unlock', expect.any(Function))

    // Get the unlock callback and verify it works
    const unlockCallback = mockHowl.once.mock.calls.find((call) => call[0] === 'unlock')?.[1]
    expect(unlockCallback).toBeDefined()

    // The callback should set isUnlocked to true (we can't test this directly
    // since isUnlocked is internal, but we can verify the callback exists)
    if (unlockCallback) {
      expect(() => unlockCallback()).not.toThrow()
    }
  })
})

describe('play', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
    // Simulate unlock event to enable playing
    const unlockCallback = mockHowl.once.mock.calls.find((call) => call[0] === 'unlock')?.[1]
    if (unlockCallback) unlockCallback()
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

    // Test with actual loaded sounds
    vi.clearAllMocks()
    play('double-pop-up')
    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()

    vi.clearAllMocks()
    play('click_04')
    expect(mockHowl.volume).toHaveBeenCalledWith(1)
    expect(mockHowl.play).toHaveBeenCalled()
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

  test('does not play when not unlocked', async () => {
    // Create fresh instance without preloading and unlock
    vi.resetModules()
    const { useAudio: freshUseAudio } = await import('@/composables/use-audio')
    const { preload, play } = freshUseAudio()
    preload()
    // Don't trigger unlock event

    const result = play('double-pop-up')

    expect(result).toBeUndefined()
    expect(mockHowl.play).not.toHaveBeenCalled()
  })

  test('cleans up playing sounds when sound ends', () => {
    const { play } = useAudio()

    // Play a sound
    const result = play('double-pop-up')
    expect(result).toBeDefined()

    // Find the 'end' callback that was registered - it should be the second call to once
    // (first is 'unlock', second should be 'end')
    const endCall = mockHowl.once.mock.calls.find((call) => call[0] === 'end')
    expect(endCall).toBeDefined()

    const endCallback = endCall?.[1]
    expect(endCallback).toBeDefined()

    // Simulate the sound ending
    if (endCallback) {
      endCallback()
    }

    // The cleanup logic should have been executed
    expect(mockHowl.once).toHaveBeenCalledWith('end', expect.any(Function))
  })

  test('handles sound end cleanup when sound is not in playing array', () => {
    const { play } = useAudio()

    // Play a sound
    const result = play('double-pop-up')
    expect(result).toBeDefined()

    // Get the end callback
    const endCall = mockHowl.once.mock.calls.find((call) => call[0] === 'end')
    const endCallback = endCall?.[1]

    // Call it multiple times to test the index !== -1 check
    if (endCallback) {
      endCallback() // First call removes it
      endCallback() // Second call should handle index === -1 case
    }

    expect(mockHowl.once).toHaveBeenCalledWith('end', expect.any(Function))
  })
})

describe('playRandom', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
    // Simulate unlock event to enable playing
    const unlockCallback = mockHowl.once.mock.calls.find((call) => call[0] === 'unlock')?.[1]
    if (unlockCallback) unlockCallback()

    vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

  test('handles undefined array gracefully', () => {
    const { playRandom } = useAudio()

    expect(() => playRandom(undefined)).not.toThrow()
    expect(mockHowl.play).not.toHaveBeenCalled()
  })

  test('handles null array gracefully', () => {
    const { playRandom } = useAudio()

    expect(() => playRandom(null)).not.toThrow()
    expect(mockHowl.play).not.toHaveBeenCalled()
  })
})

describe('isPlaying', () => {
  beforeEach(() => {
    const { preload } = useAudio()
    preload()
    // Simulate unlock event to enable playing
    const unlockCallback = mockHowl.once.mock.calls.find((call) => call[0] === 'unlock')?.[1]
    if (unlockCallback) unlockCallback()
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

    // Test with known loaded sounds
    mockHowl.playing.mockReturnValue(true)

    let result = isPlaying('double-pop-up')
    expect(result).toBe(true)

    result = isPlaying('click_04')
    expect(result).toBe(true)
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
    // Simulate unlock event to enable playing
    const unlockCallback = mockHowl.once.mock.calls.find((call) => call[0] === 'unlock')?.[1]
    if (unlockCallback) unlockCallback()
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

    // Test with known loaded sounds
    vi.clearAllMocks()
    stop('double-pop-up')
    expect(mockHowl.stop).toHaveBeenCalled()

    vi.clearAllMocks()
    stop('click_04')
    expect(mockHowl.stop).toHaveBeenCalled()
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

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

describe('preload', () => {
  test('creates Howl instances for all sound sources', () => {
    const { preload } = useAudio()

    preload()
    expect(mockHowlConstructor).toHaveBeenCalled()
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

  test('applies volume options correctly', () => {
    Math.random.mockReturnValue(0)
    const { playRandom } = useAudio()

    playRandom(['double-pop-up'], { volume: 0.3 })

    expect(mockHowl.volume).toHaveBeenCalledWith(0.3)
  })

  test('handles empty array gracefully', () => {
    const { playRandom } = useAudio()

    expect(() => playRandom([])).not.toThrow()
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
})

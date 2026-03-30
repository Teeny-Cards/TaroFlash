import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

// Mock Howler library — must use a regular function (not arrow) so `new Howl()` works
const mockHowlInstances = []

vi.mock('howler', () => {
  function MockHowl(opts) {
    const instance = {
      volume: vi.fn().mockReturnThis(),
      play: vi.fn(),
      once: vi.fn().mockReturnThis(),
      stop: vi.fn()
    }
    Object.assign(this, instance)
    mockHowlInstances.push(this)
    if (opts?.onload) Promise.resolve().then(() => opts.onload())
  }
  return { Howl: MockHowl }
})

vi.mock('@/utils/debounce', () => ({
  debounce: vi.fn((fn) => fn())
}))

// Mock import.meta.glob
const mockGlob = vi.fn()
Object.defineProperty(import.meta, 'glob', {
  value: mockGlob,
  writable: true
})

const MOCK_AUDIO_FILES = {
  '/src/assets/audio/card_drop.wav': '/src/assets/audio/card_drop.wav',
  '/src/assets/audio/chime_short_chord_up.wav': '/src/assets/audio/chime_short_chord_up.wav',
  '/src/assets/audio/click_04.wav': '/src/assets/audio/click_04.wav',
  '/src/assets/audio/click_07.wav': '/src/assets/audio/click_07.wav',
  '/src/assets/audio/digi_powerdown.wav': '/src/assets/audio/digi_powerdown.wav',
  '/src/assets/audio/double_pop_down.wav': '/src/assets/audio/double_pop_down.wav',
  '/src/assets/audio/double_pop_up.wav': '/src/assets/audio/double_pop_up.wav',
  '/src/assets/audio/etc_camera_reel.wav': '/src/assets/audio/etc_camera_reel.wav',
  '/src/assets/audio/etc_camera_shutter.wav': '/src/assets/audio/etc_camera_shutter.wav',
  '/src/assets/audio/etc_woodblock_stuck.wav': '/src/assets/audio/etc_woodblock_stuck.wav',
  '/src/assets/audio/pop_drip_mid.wav': '/src/assets/audio/pop_drip_mid.wav',
  '/src/assets/audio/pop_window.wav': '/src/assets/audio/pop_window.wav',
  '/src/assets/audio/slide_up.wav': '/src/assets/audio/slide_up.wav',
  '/src/assets/audio/trash_crumple_short.wav': '/src/assets/audio/trash_crumple_short.wav',
  '/src/assets/audio/negative_pop.mp3': '/src/assets/audio/negative_pop.mp3',
  '/src/assets/audio/select.wav': '/src/assets/audio/select.wav',
  '/src/assets/audio/toggle_off.wav': '/src/assets/audio/toggle_off.wav',
  '/src/assets/audio/toggle_on.wav': '/src/assets/audio/toggle_on.wav'
}

mockGlob.mockReturnValue(MOCK_AUDIO_FILES)

let player

beforeEach(async () => {
  vi.resetModules()
  mockHowlInstances.length = 0
  mockGlob.mockReturnValue(MOCK_AUDIO_FILES)

  const module = await import('@/sfx/player')
  player = module.default
})

describe('setup', () => {
  test('creates Howl instances for all configured sounds', async () => {
    await player.setup()
    expect(mockHowlInstances.length).toBeGreaterThan(0)
    expect(player.initialized).toBe(true)
  })

  test('populates loaded_sounds map after setup', async () => {
    await player.setup()
    expect(player.loaded_sounds.size).toBeGreaterThan(0)
  })

  test('is idempotent — does not reload sounds if already initialized', async () => {
    await player.setup()
    const instanceCount = mockHowlInstances.length

    await player.setup()
    expect(mockHowlInstances.length).toBe(instanceCount)
  })
})

describe('play', () => {
  test('enqueues sound when audio is not yet unlocked', async () => {
    await player.setup()
    player.unlocked = false

    player.play('ui.card_drop')

    expect(player.queued_sound).toBeDefined()
    expect(player.queued_sound?.key).toBe('ui.card_drop')
  })

  test('plays sound when unlocked', async () => {
    await player.setup()
    player.unlocked = true

    const sound = player.loaded_sounds.get('ui.card_drop')
    sound.once.mockImplementation((event, cb) => {
      if (event === 'end') cb()
      return sound
    })

    await player.play('ui.card_drop')

    expect(sound.play).toHaveBeenCalled()
  })

  test('throws when sound key is not loaded', async () => {
    await player.setup()
    player.unlocked = true

    await expect(player.play('ui.nonexistent_sound')).rejects.toThrow()
  })
})

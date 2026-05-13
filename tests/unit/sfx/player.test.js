import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const mockCtx = {
  state: 'running',
  resume: vi.fn()
}

vi.mock('howler', () => ({
  Howl: vi.fn(),
  Howler: {
    get ctx() {
      return mockCtx
    }
  }
}))

vi.mock('@/utils/debounce', () => ({
  debounce: (fn) => Promise.resolve(fn())
}))

const { default: audio_player } = await import('@/sfx/player')

function makeFakeSound() {
  const handlers = { end: [], playerror: [] }
  const sound = {
    volume: vi.fn().mockReturnValue(0.5),
    play: vi.fn(),
    duration: vi.fn(() => 0.2),
    once: vi.fn((evt, cb) => {
      handlers[evt]?.push(cb)
    }),
    off: vi.fn((evt, cb) => {
      const list = handlers[evt]
      if (!list) return
      const i = list.indexOf(cb)
      if (i !== -1) list.splice(i, 1)
    }),
    _fire(evt) {
      handlers[evt]?.slice().forEach((cb) => cb())
    }
  }
  return sound
}

describe('audio_player._play', () => {
  beforeEach(() => {
    mockCtx.state = 'running'
    mockCtx.resume = vi.fn().mockResolvedValue(undefined)
    audio_player.loaded_sounds.clear()
    audio_player.unlocked = true
    audio_player.queued_sound = undefined
    audio_player.blocking = false
    vi.useRealTimers()
  })

  test('resumes suspended context before playing', async () => {
    mockCtx.state = 'suspended'
    mockCtx.resume.mockImplementation(async () => {
      mockCtx.state = 'running'
    })
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    const promise = audio_player.play('ui.click')
    await Promise.resolve()
    sound._fire('end')
    await promise

    expect(mockCtx.resume).toHaveBeenCalledTimes(1)
    expect(sound.play).toHaveBeenCalledTimes(1)
  })

  test('skips play when context stays suspended after resume', async () => {
    mockCtx.state = 'suspended'
    mockCtx.resume.mockRejectedValue(new Error('needs gesture'))
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    await audio_player.play('ui.click')

    expect(mockCtx.resume).toHaveBeenCalledTimes(1)
    expect(sound.play).not.toHaveBeenCalled()
  })

  test('resolves when end event fires', async () => {
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    const promise = audio_player.play('ui.click')
    await Promise.resolve()
    sound._fire('end')

    await expect(promise).resolves.toBeUndefined()
    expect(sound.off).toHaveBeenCalledWith('end', expect.any(Function))
    expect(sound.off).toHaveBeenCalledWith('playerror', expect.any(Function))
  })

  test('resolves when playerror fires so promise does not hang', async () => {
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    const promise = audio_player.play('ui.click')
    await Promise.resolve()
    sound._fire('playerror')

    await expect(promise).resolves.toBeUndefined()
  })

  test('resolves via duration timeout fallback when no event fires', async () => {
    vi.useFakeTimers()
    const sound = makeFakeSound()
    sound.duration = vi.fn(() => 0.1)
    audio_player.loaded_sounds.set('ui.click', sound)

    let settled = false
    const promise = audio_player.play('ui.click').then(() => {
      settled = true
    })
    await vi.advanceTimersByTimeAsync(0)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(700)
    await promise

    expect(settled).toBe(true)
  })

  test('enqueues when audio system not yet unlocked', async () => {
    audio_player.unlocked = false
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    await audio_player.play('ui.click')

    expect(sound.play).not.toHaveBeenCalled()
    expect(audio_player.queued_sound).toEqual({
      key: 'ui.click',
      options: {}
    })
  })

  test('throws when sound not loaded', async () => {
    await expect(audio_player.play('ui.missing')).rejects.toThrow('Sound "ui.missing" not loaded.')
  })

  test('sets blocking flag synchronously when play() called with blocking option', () => {
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.select', sound)

    audio_player.play('ui.select', { blocking: true })

    expect(audio_player.blocking).toBe(true)
  })

  test('drops non-blocking sound while blocking flag is set', async () => {
    const blocker = makeFakeSound()
    const other = makeFakeSound()
    audio_player.loaded_sounds.set('ui.select', blocker)
    audio_player.loaded_sounds.set('ui.click_07', other)

    const blocking_promise = audio_player.play('ui.select', { blocking: true })
    await audio_player.play('ui.click_07')

    expect(other.play).not.toHaveBeenCalled()

    blocker._fire('end')
    await blocking_promise
  })

  test('clears blocking flag once the blocking sound ends', async () => {
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.select', sound)

    const promise = audio_player.play('ui.select', { blocking: true })
    expect(audio_player.blocking).toBe(true)

    await Promise.resolve()
    sound._fire('end')
    await promise

    expect(audio_player.blocking).toBe(false)
  })

  test('allows another blocking sound to play even while flag is set (self-bypass)', async () => {
    const a = makeFakeSound()
    const b = makeFakeSound()
    audio_player.loaded_sounds.set('ui.select', a)
    audio_player.loaded_sounds.set('ui.click_07', b)

    const p1 = audio_player.play('ui.select', { blocking: true })
    const p2 = audio_player.play('ui.click_07', { blocking: true })

    await Promise.resolve()
    expect(b.play).toHaveBeenCalled()

    a._fire('end')
    b._fire('end')
    await Promise.all([p1, p2])
  })

  test('clears blocking flag when context fails to resume', async () => {
    mockCtx.state = 'suspended'
    mockCtx.resume.mockRejectedValue(new Error('needs gesture'))
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.select', sound)

    await audio_player.play('ui.select', { blocking: true })

    expect(audio_player.blocking).toBe(false)
  })

  test('applies volume option before playing', async () => {
    const sound = makeFakeSound()
    audio_player.loaded_sounds.set('ui.click', sound)

    const promise = audio_player.play('ui.click', { volume: 0.9 })
    await Promise.resolve()
    sound._fire('end')
    await promise

    expect(sound.volume).toHaveBeenCalledWith(0.9)
    expect(sound.play).toHaveBeenCalled()
  })
})

import { Howl } from 'howler'
import { debounce } from '@/utils/debounce'
import {
  AUDIO_CONFIG,
  type AudioCategoryKey,
  type AudioCategory,
  type AudioKey,
  type NamespacedAudioKey,
  type AudioProperties
} from '@/sfx/config'

export type PlayOptions = {
  volume?: number
  debounce?: number
}

const DEFAULT_VOLUME = 0.25
const DEFAULT_CATEGORY_VOLUME = 0.25
const DEBOUNCE_DELAY = 50
const QUEUE_TIMEOUT = 10

class AudioPlayer {
  loaded_sounds = new Map<string, Howl>()
  initialized = false
  unlock_registered = false
  unlocked = false
  queued_sound: { key: NamespacedAudioKey; options: PlayOptions } | undefined

  setup() {
    if (this.initialized) return

    Object.entries(AUDIO_CONFIG).forEach(([category_name, category]) => {
      this._setupAudioCategory(category_name as AudioCategoryKey, category)
    })

    this.initialized = true
  }

  play = async (key: NamespacedAudioKey, options: PlayOptions = {}): Promise<void> => {
    return debounce(() => this._play(key, options), {
      delay: options.debounce ?? DEBOUNCE_DELAY,
      key
    })
  }

  private _enqueue = (key: NamespacedAudioKey, options: PlayOptions = {}) => {
    this.queued_sound = { key, options }

    setTimeout(() => {
      if (this.queued_sound?.key === key) {
        this.queued_sound = undefined
      }
    }, QUEUE_TIMEOUT)
  }

  private _play = async (key: NamespacedAudioKey, options: PlayOptions = {}): Promise<void> => {
    if (!this.unlocked) {
      this._enqueue(key, options)
      return
    }

    return new Promise((resolve) => {
      const sound = this.loaded_sounds.get(key)

      if (!sound) {
        throw new Error(`Sound "${key}" not loaded.`)
      }

      sound.volume(options.volume ?? sound.volume())
      sound.once('end', () => resolve())
      sound.play()
    })
  }

  private _setupAudioCategory = (category_name: AudioCategoryKey, category: AudioCategory) => {
    return Object.entries(category).forEach(([name, cfg]) => {
      const url = cfg.path ?? `/src/assets/audio/${name}.${cfg.ext ?? 'wav'}`

      if (!url) {
        throw new Error(`Audio file for "${category}.${name}" not found at ${url}`)
      }

      const key: NamespacedAudioKey = `${category_name}.${name as AudioKey}`
      const categoryVolume = DEFAULT_CATEGORY_VOLUME
      const volume = (cfg.default_volume ?? DEFAULT_VOLUME) * categoryVolume

      const sound = new Howl({
        src: [url],
        preload: cfg.preload ?? true,
        volume
      })

      this._registerUnlock(sound)
      this.loaded_sounds.set(key, sound)
    })
  }

  /**
   * Callback for when the audio system is unlocked.
   * Plays any queued sound.
   */
  private _onUnlock = () => {
    this.unlocked = true

    if (this.queued_sound) {
      const { key, options } = this.queued_sound
      this.play(key, options)
      this.queued_sound = undefined
    }
  }

  /**
   * Registers the unlock callback for the audio system.
   * Only registers once.
   */
  private _registerUnlock = (sound: Howl) => {
    if (!this.unlock_registered) {
      this.unlock_registered = true
      sound.once('unlock', this._onUnlock)
    }
  }
}

// Export instance as a singleton
export default new AudioPlayer()

export function createAudioConfig<T extends CreateAudioConfigArguments>(config: T) {
  return config as {
    [C in keyof T]: {
      [K in keyof T[C]]: AudioProperties
    }
  }
}

type CreateAudioConfigArguments = { [category: string]: { [name: string]: AudioProperties } }

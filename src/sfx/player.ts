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
    this.initialized = true

    const categories = Object.entries(AUDIO_CONFIG)

    return Promise.all(
      categories.map(([name, category]) =>
        this._setupAudioCategory(name as AudioCategoryKey, category)
      )
    )
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

  private async _setupAudioCategory(
    category_name: AudioCategoryKey,
    category: AudioCategory
  ): Promise<void> {
    const entries = Object.entries(category)

    const loads = entries.map(([name, cfg]) => {
      const key: NamespacedAudioKey = `${category_name}.${name as AudioKey}`
      const categoryVolume = DEFAULT_CATEGORY_VOLUME
      const volume = (cfg.default_volume ?? DEFAULT_VOLUME) * categoryVolume

      return this._createPreloadedHowl(key, cfg, volume).then((sound) => {
        this.loaded_sounds.set(key, sound)
      })
    })

    await Promise.all(loads)
  }

  private _createPreloadedHowl(
    key: NamespacedAudioKey,
    cfg: AudioProperties,
    volume: number
  ): Promise<Howl> {
    const audio_name = key.split('.')[1]
    const url = cfg.path ?? `/src/assets/audio/${audio_name}.${cfg.ext ?? 'wav'}`

    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [url],
        preload: cfg.preload ?? true,
        volume,
        onload: () => resolve(sound),
        onloaderror: (_, err) => reject(new Error(`Failed to load audio "${key}": ${err}`))
      })

      this._registerUnlock(sound)
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

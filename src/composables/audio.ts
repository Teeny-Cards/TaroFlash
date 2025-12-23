// useAudio.ts
import { Howl } from 'howler'
import { ref } from 'vue'
import { useLogger } from '@/composables/logger'
import { debounce } from '@/utils/debounce'
import { AUDIO_CONFIG } from '@/config/audio'

const logger = useLogger()
const DEFAULT_VOLUME = 1
const DEFAULT_CATEGORY_VOLUME = 0.5
const DEBOUNCE_DELAY = 50
const QUEUE_TIMEOUT = 10

const loaded_sounds = new Map<string, Howl>()
const initialized = ref(false)
const unlock_registered = ref(false)
const unlocked = ref(false)
const queued_sound = ref<{ key: NamespacedAudioKey; options: PlayOptions } | undefined>()

type PlayOptions = {
  volume?: number
  debounce?: number
}

export function useAudio() {
  const setup = () => {
    if (initialized.value) return

    Object.entries(AUDIO_CONFIG).forEach(([category_name, category]) => {
      _setupAudioCategory(category_name as AudioCategoryKey, category)
    })

    initialized.value = true
  }

  const play = async (
    key: NamespacedAudioKey,
    options: PlayOptions = {}
  ): Promise<Howl | undefined> => {
    return debounce(() => _play(key, options), {
      delay: options.debounce ?? DEBOUNCE_DELAY,
      key
    })
  }

  /**
   * Queues a sound to be played when the audio system is unlocked.
   * Clears the queue after a short timeout to prevent unexpected
   * sounds from playing when the system is unlocked.
   */
  const enqueue = (key: NamespacedAudioKey, options: PlayOptions = {}) => {
    queued_sound.value = { key, options }

    setTimeout(() => {
      if (queued_sound.value?.key === key) {
        queued_sound.value = undefined
      }
    }, QUEUE_TIMEOUT)
  }

  const _play = async (
    key: NamespacedAudioKey,
    options: PlayOptions = {}
  ): Promise<Howl | undefined> => {
    if (!unlocked.value) {
      enqueue(key, options)
      return
    }

    return new Promise((resolve) => {
      const sound = loaded_sounds.get(key)

      if (!sound) {
        logger.warn(`Sound "${key}" not loaded.`)
        return
      }

      sound.volume(options.volume ?? sound.volume())
      sound.once('end', () => resolve(sound))
      sound.play()
    })
  }

  const _setupAudioCategory = (category_name: AudioCategoryKey, category: AudioCategory) => {
    return Object.entries(category).forEach(([name, cfg]) => {
      const url = cfg.path ?? `/src/assets/audio/${name}.${cfg.ext ?? 'wav'}`

      if (!url) {
        logger.warn(`Audio file for "${category}.${name}" not found at ${url}`)
        return
      }

      const key: NamespacedAudioKey = `${category_name}.${name as AudioKey}`
      const categoryVolume = DEFAULT_CATEGORY_VOLUME
      const volume = (cfg.default_volume ?? DEFAULT_VOLUME) * categoryVolume

      const sound = new Howl({
        src: [url],
        preload: cfg.preload ?? true,
        volume
      })

      _registerUnlock(sound)
      loaded_sounds.set(key, sound)
    })
  }

  /**
   * Callback for when the audio system is unlocked.
   * Plays any queued sound.
   */
  const _onUnlock = () => {
    unlocked.value = true

    if (queued_sound.value) {
      const { key, options } = queued_sound.value
      play(key, options)
      queued_sound.value = undefined
    }
  }

  /**
   * Registers the unlock callback for the audio system.
   * Only registers once.
   */
  const _registerUnlock = (sound: Howl) => {
    if (!unlock_registered.value) {
      unlock_registered.value = true
      sound.once('unlock', _onUnlock)
    }
  }

  return {
    setup,
    play,
    stop,
    initialized: initialized as Readonly<typeof initialized>
  }
}

export function createAudioConfig<T extends CreateAudioConfigArguments>(config: T) {
  return config as {
    [C in keyof T]: {
      [K in keyof T[C]]: AudioProperties
    }
  }
}

type CreateAudioConfigArguments = { [category: string]: { [name: string]: AudioProperties } }
type AudioProperties = {
  path?: string
  ext?: string
  default_volume?: number
  preload?: boolean
}

type AudioConfig = typeof AUDIO_CONFIG
type AudioCategoryKey = keyof AudioConfig
type AudioCategory = AudioConfig[AudioCategoryKey]
type AudioKey = keyof AudioCategory

export type NamespacedAudioKey = {
  [C in AudioCategoryKey]: `${C}.${keyof AudioConfig[C] & string}`
}[AudioCategoryKey]

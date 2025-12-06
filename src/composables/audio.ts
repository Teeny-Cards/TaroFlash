// useAudio.ts
import { Howl, Howler } from 'howler'
import { ref } from 'vue'
import { useLogger } from '@/composables/logger'
import { debounce } from '@/utils/debounce'
import { AUDIO_CONFIG } from '@/config/audio'

const logger = useLogger()
const DEFAULT_VOLUME = 1
const DEFAULT_CATEGORY_VOLUME = 0.5
const DEBOUNCE_DELAY = 50
const QUEUE_TIMEOUT = 10

const loadedSounds = new Map<string, Howl>()
const isInitialized = ref(false)
const playingSounds = ref<Howl[]>([])
const unlocked = ref(false)
const queued_sound = ref<{ key: NamespacedAudioKey; options: PlayOptions } | undefined>()

type PlayOptions = {
  volume?: number
  debounce?: number
}

export function useAudio() {
  const preload = () => {
    if (isInitialized.value) return

    const sound = new Howl({
      src: ['/src/assets/audio/double-pop-up.wav'],
      volume: 0
    })

    sound.once('unlock', () => {
      unlocked.value = true

      if (queued_sound.value) {
        const { key, options } = queued_sound.value
        play(key, options)
        queued_sound.value = undefined
      }
    })

    Object.entries(AUDIO_CONFIG).forEach(([category_name, category]) => {
      setupAudioCategory(category_name as AudioCategoryKey, category)
    })

    isInitialized.value = true
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
  const queueSound = (key: NamespacedAudioKey, options: PlayOptions = {}) => {
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
      queueSound(key, options)
      return
    }

    const sound = loadedSounds.get(key)

    if (sound) {
      sound.volume(options.volume ?? 1)
      sound.play()

      sound.once('end', () => {
        const index = playingSounds.value.indexOf(sound)
        if (index !== -1) {
          playingSounds.value.splice(index, 1)
        }
      })

      playingSounds.value.push(sound)
      return sound
    } else {
      logger.warn(`Sound "${key}" not loaded.`)
    }
  }

  const setupAudioCategory = (category_name: AudioCategoryKey, category: AudioCategory) => {
    return Object.entries(category).forEach(([name, cfg]) => {
      const url = cfg.path ?? `/src/assets/audio/${name}.${cfg.ext ?? 'wav'}`

      if (!url) {
        logger.warn(
          `Audio config references "${cfg.path}" for "${category}.${name}" but file not found at ${url}`
        )
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

      loadedSounds.set(key, sound)
    })
  }

  return {
    preload,
    play,
    stop,
    isInitialized: isInitialized as Readonly<typeof isInitialized>
  }
}

export function createAudioConfig<const T extends Record<string, Record<string, AudioProperties>>>(
  config: T
) {
  return config as {
    [C in keyof T]: {
      [K in keyof T[C]]: AudioProperties
    }
  }
}

export type AudioProperties = {
  path?: string
  ext?: string
  default_volume?: number
  preload?: boolean
}
export type AudioConfig = typeof AUDIO_CONFIG
export type AudioCategoryKey = keyof AudioConfig
export type AudioCategory = AudioConfig[AudioCategoryKey]
export type AudioKey = keyof AudioCategory
export type NamespacedAudioKey = {
  [C in AudioCategoryKey]: `${C}.${keyof AudioConfig[C] & string}`
}[AudioCategoryKey]

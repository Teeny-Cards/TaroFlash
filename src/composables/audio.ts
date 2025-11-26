// useAudio.ts
import { Howl, Howler } from 'howler'
import { ref } from 'vue'
import { useLogger } from '@/composables/logger'
import { debounce } from '@/utils/debounce'

const logger = useLogger()
const DEBOUNCE_DELAY = 100

const loadedSounds = new Map<string, Howl>()
const isInitialized = ref(false)
const playingSounds = ref<Howl[]>([])
const unlocked = ref(false)
const queued_sound = ref<{ key: string; options: PlayOptions } | undefined>()

let debounce_timeout: number | null = null

type PlayOptions = {
  volume?: number
  debounce?: number
}

export function useAudio() {
  Howler.volume(0.5)

  const preload = () => {
    if (isInitialized.value) return

    const audioFiles = import.meta.glob('/src/assets/audio/*.wav', { eager: true, as: 'url' })

    const sources = Object.entries(audioFiles).map(([path, url]) => {
      const filename = path.split('/').pop()!.split('.')[0]
      return { key: filename, url }
    })

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

    sources.forEach((src) => {
      const sound = new Howl({
        src: [src.url],
        preload: true
      })

      loadedSounds.set(src.key, sound)
    })

    isInitialized.value = true
  }

  const play = async (
    key: string,
    options: PlayOptions = {},
    debounce_ms: number = DEBOUNCE_DELAY
  ): Promise<Howl | undefined> => {
    if (!unlocked.value) {
      queued_sound.value = { key, options }
      return
    }

    if (debounce_ms > 0) {
      if (debounce_timeout) {
        clearTimeout(debounce_timeout)
      }

      return new Promise((resolve) => {
        const timer = window.setTimeout(async () => {
          debounce_timeout = null
          resolve(await _play(key, options))
        }, debounce_ms)

        debounce_timeout = timer
      })
    }
  }

  const _play = async (key: string, options: PlayOptions = {}): Promise<Howl | undefined> => {
    if (!unlocked.value) {
      queued_sound.value = { key, options }
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

  return {
    preload,
    play,
    stop,
    isInitialized: isInitialized as Readonly<typeof isInitialized>
  }
}

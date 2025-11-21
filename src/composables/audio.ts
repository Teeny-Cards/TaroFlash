// useAudio.ts
import { Howl, Howler } from 'howler'
import { ref } from 'vue'
import { useLogger } from '@/composables/logger'

const logger = useLogger()

const loadedSounds = new Map<string, Howl>()
const isInitialized = ref(false)
const playingSounds = ref<Howl[]>([])
const unlocked = ref(false)
const queued_sound = ref<{ key: string; options: PlayOptions } | undefined>()

type PlayOptions = {
  volume?: number
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

  const play = async (key: string, options: PlayOptions = {}): Promise<Howl | undefined> => {
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

  const playRandom = (keys: string[], options: PlayOptions = {}) => {
    if (!keys || keys.length === 0) return
    const key = keys[Math.floor(Math.random() * keys.length)]
    play(key, options)
  }

  const isPlaying = (key: string) => {
    const sound = loadedSounds.get(key)
    return sound ? sound.playing() : false
  }

  const stop = (key: string) => {
    const sound = loadedSounds.get(key)
    if (sound) sound.stop()
  }

  const muteAll = (muted: boolean) => {
    Howler.mute(muted)
  }

  return {
    preload,
    play,
    playRandom,
    stop,
    muteAll,
    isPlaying,
    isInitialized: isInitialized as Readonly<typeof isInitialized>
  }
}

// useAudio.ts
import { Howl, Howler } from 'howler'
import { ref } from 'vue'
import { useLogger } from '@/composables/use-logger'

const logger = useLogger()

const loadedSounds = new Map<string, Howl>()
const isInitialized = ref(false)

type PlayOptions = {
  volume?: number
}

export function useAudio() {
  Howler.autoUnlock = false

  const preload = () => {
    if (isInitialized.value) return

    const audioFiles = import.meta.glob('/src/assets/audio/*.wav', { eager: true, as: 'url' })

    const sources = Object.entries(audioFiles).map(([path, url]) => {
      const filename = path.split('/').pop()!.split('.')[0]
      return { key: filename, url }
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

  const play = (key: string, options: PlayOptions = {}) => {
    const sound = loadedSounds.get(key)

    if (sound) {
      sound.volume(options.volume ?? 1)
      sound.play()
    } else {
      logger.warn(`Sound "${key}" not loaded.`)
    }
  }

  const playRandom = (keys: string[], options: PlayOptions = {}) => {
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

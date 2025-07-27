// useAudio.ts
import { Howl, Howler } from 'howler'
import { ref } from 'vue'

const loadedSounds = new Map<string, Howl>()
const isInitialized = ref(false)
const ASSET_PATH = '/src/assets/audio/'

type PlayOptions = {
  volume?: number
}

const sources = [
  'double-pop-up.wav',
  'double-pop-down.wav',
  'click_04.wav',
  'etc_woodblock_stuck.wav',
  'digi_powerdown.wav',
  'trash_crumple_short.wav',
  'chime_short_chord_up.wav',
  'etc_camera_shutter.wav'
] as const

type StripExtension<T> = T extends `${infer Name}.${string}` ? Name : never
type SoundKey = StripExtension<(typeof sources)[number]>

export function useAudio() {
  Howler.autoUnlock = false

  const preload = () => {
    if (isInitialized.value) return

    sources.forEach((src) => {
      const sound = new Howl({
        src: [ASSET_PATH + src],
        preload: true
      })

      const key = src.split('/').pop()!.split('.').shift()! // Extract the filename without extension
      loadedSounds.set(key, sound)
    })

    isInitialized.value = true
  }

  const play = (key: SoundKey, options: PlayOptions = {}) => {
    const sound = loadedSounds.get(key)
    if (sound) {
      sound.volume(options.volume ?? 1)
      sound.play()
    } else console.warn(`Sound "${key}" not loaded.`)
  }

  const playRandom = (keys: SoundKey[], options: PlayOptions = {}) => {
    const key = keys[Math.floor(Math.random() * keys.length)]
    play(key, options)
  }

  const isPlaying = (key: SoundKey) => {
    const sound = loadedSounds.get(key)
    return sound ? sound.playing() : false
  }

  const stop = (key: SoundKey) => {
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

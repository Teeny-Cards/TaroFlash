import { createAudioConfig } from '@/composables/audio'

export const AUDIO_CONFIG = createAudioConfig({
  ui: {
    card_drop: {},
    chime_short_chord_up: {},
    click_04: {},
    click_07: {},
    digi_powerdown: {},
    double_pop_down: {},
    double_pop_up: {},
    etc_camera_reel: {},
    etc_camera_shutter: {},
    etc_woodblock_stuck: {},
    pop_drip_mid: {},
    pop_window: {},
    slide_up: {},
    trash_crumple_short: {}
  }
})

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

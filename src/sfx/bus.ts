import { type AudioCategoryKey, type NamespacedAudioKey } from './config'
import player, { type PlayOptions } from './player'

type PolicyState = {
  enabled: boolean
  categories: { [key in AudioCategoryKey]: boolean }
  disable_hover_on_touch: boolean
}

let policy: PolicyState = {
  enabled: true,
  categories: { ui: true },
  disable_hover_on_touch: true
}

export function setSfxPolicy(partial: Partial<PolicyState>) {
  policy = { ...policy, ...partial }
}

/**
 * Plays a sound effect.
 *
 * @param audio_key The key of the sound to play.
 * @param opts Options for playing the sound.
 * @returns A promise that resolves when the sound has finished playing.
 */
export function emitSfx(audio_key: NamespacedAudioKey, opts: PlayOptions = {}) {
  if (!policy.enabled) return

  const category = _getCategoryFromKey(audio_key)
  if (!policy.categories[category]) return

  return player.play(audio_key, opts)
}

/**
 * Plays a sound effect. If touch is the primary input method, does nothing.
 *
 * @param event The key of the sound to play.
 * @param opts Options for playing the sound.
 * @returns A promise that resolves when the sound has finished playing.
 */
export function emitHoverSfx(event: NamespacedAudioKey, opts: PlayOptions = {}) {
  if (policy.disable_hover_on_touch && _isTouchPrimary()) return

  return emitSfx(event, opts)
}

function _isTouchPrimary(): boolean {
  return typeof window !== 'undefined' && 'ontouchstart' in window
}

function _getCategoryFromKey(audio_key: NamespacedAudioKey): AudioCategoryKey {
  return audio_key.split('.')[0] as AudioCategoryKey
}

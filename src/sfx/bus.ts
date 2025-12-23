// sfx/bus.ts
import { shallowRef } from 'vue'
import { type AudioCategoryKey, type NamespacedAudioKey } from './audio-config'
import { useAudio } from '@/composables/audio'

export type SfxEmitOptions = {
  key?: string
  throttle_ms?: number
  oncer_per_frame?: boolean
}

type PolicyState = {
  enabled: boolean
  categories: Record<AudioCategoryKey, boolean>
  disable_hover_on_touch: boolean
}

const policy = shallowRef<PolicyState>({
  enabled: true,
  categories: { ui: true },
  disable_hover_on_touch: true
})

export function setSfxPolicy(partial: Partial<PolicyState>) {
  policy.value = { ...policy.value, ...partial }
}

export function emitSfx(audio_key: NamespacedAudioKey, opts: SfxEmitOptions = {}) {
  const p = policy.value
  if (!p.enabled) return

  const { play } = useAudio()
  play(audio_key, { debounce: opts.throttle_ms })
}

// Helper specifically for hover policy
export function emitHoverSfx(event: NamespacedAudioKey, opts: SfxEmitOptions = {}) {
  if (policy.value.disable_hover_on_touch && _isTouchPrimary()) return
  emitSfx(event, opts)
}

function _isTouchPrimary(): boolean {
  return typeof window !== 'undefined' && 'ontouchstart' in window
}

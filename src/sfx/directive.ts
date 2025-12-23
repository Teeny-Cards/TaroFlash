// sfx/directive.ts
import type { Directive } from 'vue'
import { emitSfx, emitHoverSfx } from './bus'
import { type NamespacedAudioKey } from './audio-config'

export type SfxOptions = {
  click?: NamespacedAudioKey
  hover?: NamespacedAudioKey
  focus?: NamespacedAudioKey
  blur?: NamespacedAudioKey
  key?: string
  throttle_ms?: number
}

type SfxBindingValue = NamespacedAudioKey | SfxOptions

type Cleanup = () => void

function add(el: HTMLElement, event: string, handler: EventListener) {
  el.addEventListener(event, handler, { passive: true })
  return () => el.removeEventListener(event, handler)
}

export const vSfx: Directive<HTMLElement, SfxBindingValue> = {
  mounted(el, binding) {
    if (!binding.value) return

    const cleanups: Cleanup[] = []
    const mods = binding.modifiers

    const parse = () => {
      const v = binding.value

      if (typeof v === 'string') {
        let c: SfxBindingValue = {}

        if (mods.click) c = { ...c, click: v }
        if (mods.hover) c = { ...c, hover: v }
        if (mods.focus) c = { ...c, focus: v }
        if (mods.blur) c = { ...c, blur: v }

        return c
      }

      return v
    }

    const cfg = parse()
    const base_key = cfg.key

    if (mods.click && cfg.click) {
      cleanups.push(
        add(el, 'click', (e) => {
          if (mods.prevent) e.preventDefault()
          if (mods.stop) e.stopPropagation()

          emitSfx(cfg.click!, { key: base_key ?? cfg.click })
        })
      )
    }

    if (mods.hover && cfg.hover) {
      cleanups.push(
        add(el, 'mouseenter', () => {
          console.log('hover')
          emitHoverSfx(cfg.hover!, {
            key: base_key ?? cfg.hover,
            throttle_ms: cfg.throttle_ms
          })
        })
      )
    }

    if (mods.focus && cfg.focus) {
      cleanups.push(add(el, 'focus', () => emitSfx(cfg.focus!, { key: base_key ?? cfg.focus })))
    }

    if (mods.blur && cfg.blur) {
      cleanups.push(add(el, 'blur', () => emitSfx(cfg.blur!, { key: base_key ?? cfg.blur })))
    }

    ;(el as any).__vSfxCleanup = () => cleanups.forEach((c) => c())
  },

  beforeUnmount(el) {
    ;(el as any).__vSfxCleanup?.()
  }
}

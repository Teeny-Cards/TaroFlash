import { defineStore } from 'pinia'
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'

export type KeyCombo = string // Canonical combo format: "ctrl+shift+k", "esc", "tab", "shift+tab"
export type ScopeId = string
export type ShortcutId = string

export type ShortcutRegistry = {
  scopeId: ScopeId
  id: ShortcutId
  combo: KeyCombo
  description: string
  group?: string
  active: boolean
  advertised: boolean
  topmost: boolean
}

export type Shortcut = {
  id: ShortcutId
  combo: KeyCombo
  description: string
  once?: boolean // auto-unregister after it fires once
  advertise?: boolean // show in the menu even when inactive
  group?: string // group label for menu (e.g., "Card Editor")
  when?: () => boolean // trigger guard — callers provide their own conditions
  handler: (ev: KeyboardEvent) => boolean | void // the handler. Return `true` if handled (prevents lower scopes)
}

type Scope = {
  id: ScopeId
  priority: number // stack order; higher = top (monotonic increasing)
  shortcuts: Map<ShortcutId, Shortcut>
}

function normalizeComboFromEvent(ev: KeyboardEvent): KeyCombo {
  const mods: string[] = []

  if (ev.ctrlKey) mods.push('ctrl')
  if (ev.metaKey) mods.push('meta')
  if (ev.altKey) mods.push('alt')
  if (ev.shiftKey) mods.push('shift')
  // Prefer a small set of names:
  const k = ev.key.toLowerCase()
  // Map common names
  const key = k === 'escape' ? 'esc' : k === ' ' ? 'space' : k
  const parts = [...mods.sort(), key]
  return parts.join('+')
}

function normalizeComboText(text: string): KeyCombo {
  // "Shift + Tab" -> "shift+tab"
  return text
    .split('+')
    .map((s) => s.trim().toLowerCase())
    .sort((a, b) => {
      // enforce mod order: alt,ctrl,meta,shift, then key
      const order = { alt: 1, ctrl: 2, meta: 3, shift: 4 }
      return (order[a as keyof typeof order] ?? 9) - (order[b as keyof typeof order] ?? 9)
    })
    .join('+')
}

let priorityCounter = 0

export const useShortcutStore = defineStore('shortcutStore', () => {
  const scopes = reactive<Scope[]>([])

  const registry = computed(() => {
    const items: ShortcutRegistry[] = []
    const topScopeId = scopes.at(-1)?.id

    for (const scope of scopes) {
      for (const shortcut of scope.shortcuts.values()) {
        const active = shortcut.when ? !!shortcut.when() : true
        const advertised = !!shortcut.advertise

        if (active || advertised) {
          items.push({
            scopeId: scope.id,
            id: shortcut.id,
            combo: shortcut.combo,
            description: shortcut.description,
            group: shortcut.group,
            active,
            advertised,
            topmost: scope.id === topScopeId
          })
        }
      }
    }

    return items
  })

  onMounted(() => {
    document.addEventListener('keydown', _handleKeyEvent)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', _handleKeyEvent)
  })

  function pushScope(id: ScopeId): void {
    if (scopes.find((s) => s.id === id)) return

    scopes.push({ id, priority: ++priorityCounter, shortcuts: new Map() })
    sortByPriority()
  }

  function popScope(id?: ScopeId) {
    if (!scopes.length) return

    if (!id) {
      scopes.pop()
      return
    }

    const idx = scopes.findIndex((s) => s.id === id)
    if (idx >= 0) {
      scopes.splice(idx, 1)
    }
  }

  function sortByPriority() {
    scopes.sort((a, b) => a.priority - b.priority)
  }

  function registerShortcut(scopeId: ScopeId, shortcut: Shortcut) {
    const scope = scopes.find((s) => s.id === scopeId)
    if (!scope) return

    const normalized = { ...shortcut, combo: normalizeComboText(shortcut.combo) }
    scope.shortcuts.set(normalized.id, normalized)
  }

  function unregisterShortcut(scopeId: ScopeId, shortcutId: ShortcutId) {
    const scope = scopes.find((s) => s.id === scopeId)
    if (!scope) return

    scope.shortcuts.delete(shortcutId)
  }

  function clearScope(scopeId: ScopeId) {
    const scope = scopes.find((s) => s.id === scopeId)
    if (!scope) return

    scope.shortcuts.clear()
  }

  function _handleKeyEvent(ev: KeyboardEvent) {
    const combo = normalizeComboFromEvent(ev)

    // Walk scopes from top to bottom
    for (let i = scopes.length - 1; i >= 0; i--) {
      const scope = scopes[i]

      // find first matching, active shortcut within this scope
      for (const sc of scope.shortcuts.values()) {
        if (sc.combo !== combo) continue

        const active = sc.when ? !!sc.when() : true
        if (!active) continue

        const handled = sc.handler(ev) ?? true
        if (handled) {
          ev.preventDefault()
          ev.stopPropagation()

          if (sc.once) {
            scope.shortcuts.delete(sc.id)
          }

          return
        }
      }
    }
  }

  return {
    scopes,
    registry,
    pushScope,
    popScope,
    clearScope,
    registerShortcut,
    unregisterShortcut
  }
})

import { onScopeDispose, getCurrentScope } from 'vue'
import {
  useShortcutStore,
  type Shortcut,
  type ScopeId,
  type Priority,
  type ShortcutId
} from '@/stores/shortcut-store'

export type ShortcutRegistration = Omit<Shortcut, 'id'>

export function useShortcuts(id: ScopeId, { priority }: { priority?: Priority } = {}) {
  const store = useShortcutStore()
  const scope_id = store.pushScope(id, priority)

  function register(shortcuts: ShortcutRegistration[] | ShortcutRegistration) {
    const _shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts]
    const shortcut_ids: ShortcutId[] = []

    for (const shortcut of _shortcuts) {
      const id = store.register(scope_id, shortcut)
      if (id) shortcut_ids.push(id)
    }

    const unregister = () => {
      for (const shortcut_id of shortcut_ids) store.unregister(scope_id, shortcut_id)
    }

    // unregister when the component is destroyed
    if (getCurrentScope()) {
      onScopeDispose(unregister)
    }
  }

  function trapFocus() {
    store.setActiveNamespace(id)
  }

  function releaseFocus() {
    store.clearNamespace(id)
  }

  function clearScope() {
    store.clearScope(scope_id)
  }

  function popScope() {
    store.popScope(scope_id)
  }

  function dispose() {
    releaseFocus()
    popScope()
  }

  return {
    scope_id,
    register,
    trapFocus,
    releaseFocus,
    clearScope,
    popScope,
    dispose
  }
}

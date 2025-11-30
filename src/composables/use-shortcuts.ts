import { onBeforeUnmount, getCurrentInstance } from 'vue'
import {
  useShortcutStore,
  type Shortcut,
  type ScopeId,
  type Priority
} from '@/stores/shortcut-store'

export function useShortcuts(id: ScopeId, { priority }: { priority?: Priority } = {}) {
  const store = useShortcutStore()
  const scope_id = store.pushScope(id, priority)

  function register(shortcuts: Shortcut[] | Shortcut) {
    const _shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts]

    for (const shortcut of _shortcuts) {
      store.register(scope_id, shortcut)
    }

    // Return a function to unregister the shortcuts
    return () => {
      for (const sc of _shortcuts) store.unregister(scope_id, sc.id)
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

  if (getCurrentInstance()) {
    onBeforeUnmount(dispose)
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

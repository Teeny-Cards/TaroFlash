import { onBeforeUnmount, onMounted } from 'vue'
import { useShortcutStore, type Shortcut, type ScopeId } from '@/stores/shortcut-store'

export function useShortcuts(scopeId: ScopeId) {
  const store = useShortcutStore()

  onMounted(() => {
    store.pushScope(scopeId)
  })

  function register(shortcuts: Shortcut[] | Shortcut) {
    const _shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts]

    for (const shortcut of _shortcuts) {
      store.registerShortcut(scopeId, shortcut)
    }

    // Return a function to unregister the shortcuts
    return () => {
      for (const sc of _shortcuts) store.unregisterShortcut(scopeId, sc.id)
    }
  }

  function clear() {
    store.clearScope(scopeId)
  }

  function pop() {
    store.popScope(scopeId)
  }

  onBeforeUnmount(() => {
    pop()
  })

  return {
    scopeId,
    register,
    clear,
    pop
  }
}

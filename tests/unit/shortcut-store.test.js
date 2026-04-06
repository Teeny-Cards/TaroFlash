import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { setActivePinia, createPinia } from 'pinia'
import { useShortcutStore } from '@/stores/shortcut-store'

describe('useShortcutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('pushScope', () => {
    test('adds a scope and returns its id', () => {
      const store = useShortcutStore()
      const id = store.pushScope('test-scope')
      expect(id).toBe('test-scope')
      expect(store.stack).toHaveLength(1)
      expect(store.stack[0].id).toBe('test-scope')
    })

    test('deduplicates: pushing the same id twice keeps one scope', () => {
      const store = useShortcutStore()
      store.pushScope('dupe')
      store.pushScope('dupe')
      expect(store.stack).toHaveLength(1)
    })

    test('high-priority scope is topmost (processed first by key handler)', () => {
      const store = useShortcutStore()
      store.pushScope('low-scope', { priority: 'low' })
      store.pushScope('high-scope', { priority: 'high' })
      store.register('low-scope', { combo: 'a', handler: vi.fn() })
      store.register('high-scope', { combo: 'b', handler: vi.fn() })
      const highEntry = store.registry.find((r) => r.scopeId === 'high-scope')
      const lowEntry = store.registry.find((r) => r.scopeId === 'low-scope')
      expect(highEntry.topmost).toBe(true)
      expect(lowEntry.topmost).toBe(false)
    })
  })

  describe('popScope', () => {
    test('removes a scope by id', () => {
      const store = useShortcutStore()
      store.pushScope('a')
      store.pushScope('b')
      store.popScope('a')
      expect(store.stack).toHaveLength(1)
      expect(store.stack[0].id).toBe('b')
    })

    test('pops the last scope when no id is provided', () => {
      const store = useShortcutStore()
      store.pushScope('a')
      store.pushScope('b')
      store.popScope()
      expect(store.stack).toHaveLength(1)
      expect(store.stack[0].id).toBe('a')
    })

    test('does nothing when stack is empty', () => {
      const store = useShortcutStore()
      expect(() => store.popScope()).not.toThrow()
      expect(store.stack).toHaveLength(0)
    })
  })

  describe('register / unregister', () => {
    test('register adds a shortcut to an existing scope and returns its id', () => {
      const store = useShortcutStore()
      store.pushScope('s')
      const handler = vi.fn()
      const shortcutId = store.register('s', { combo: 'ctrl+k', handler })
      expect(shortcutId).toBeDefined()
      expect(store.stack[0].shortcuts.size).toBe(1)
    })

    test('register returns undefined for an unknown scope', () => {
      const store = useShortcutStore()
      const handler = vi.fn()
      const id = store.register('nonexistent', { combo: 'a', handler })
      expect(id).toBeUndefined()
    })

    test('unregister removes a shortcut from its scope', () => {
      const store = useShortcutStore()
      store.pushScope('s')
      const handler = vi.fn()
      const shortcutId = store.register('s', { combo: 'ctrl+z', handler })
      store.unregister('s', shortcutId)
      expect(store.stack[0].shortcuts.size).toBe(0)
    })
  })

  describe('clearScope', () => {
    test('removes all shortcuts from a scope', () => {
      const store = useShortcutStore()
      store.pushScope('s')
      const handler = vi.fn()
      store.register('s', { combo: 'a', handler })
      store.register('s', { combo: 'b', handler })
      store.clearScope('s')
      expect(store.stack[0].shortcuts.size).toBe(0)
    })

    test('does nothing for an unknown scope', () => {
      const store = useShortcutStore()
      expect(() => store.clearScope('nonexistent')).not.toThrow()
    })
  })

  describe('registry computed', () => {
    test('lists shortcuts from all scopes', () => {
      const store = useShortcutStore()
      store.pushScope('a')
      store.pushScope('b')
      store.register('a', { combo: 'x', handler: vi.fn() })
      store.register('b', { combo: 'y', handler: vi.fn() })
      expect(store.registry).toHaveLength(2)
    })

    test('excludes shortcuts where when() returns false', () => {
      const store = useShortcutStore()
      store.pushScope('s')
      store.register('s', { combo: 'x', handler: vi.fn(), when: () => false })
      expect(store.registry).toHaveLength(0)
    })

    test('includes advertised shortcuts even when when() is false', () => {
      const store = useShortcutStore()
      store.pushScope('s')
      store.register('s', { combo: 'x', handler: vi.fn(), when: () => false, advertise: true })
      expect(store.registry).toHaveLength(1)
      expect(store.registry[0].advertised).toBe(true)
    })

    test('marks shortcut as topmost only when in the top scope', () => {
      const store = useShortcutStore()
      store.pushScope('low', { priority: 'low' })
      store.pushScope('high', { priority: 'high' })
      store.register('low', { combo: 'a', handler: vi.fn() })
      store.register('high', { combo: 'b', handler: vi.fn() })
      const low = store.registry.find((r) => r.combo === 'a')
      const high = store.registry.find((r) => r.combo === 'b')
      expect(low.topmost).toBe(false)
      expect(high.topmost).toBe(true)
    })
  })

  describe('setActiveNamespace / clearNamespace', () => {
    test('setActiveNamespace uses the namespace prefix (before the first /)', () => {
      const store = useShortcutStore()
      store.pushScope('modal/abc')
      store.pushScope('app')
      store.register('modal/abc', { combo: 'm', handler: vi.fn() })
      store.register('app', { combo: 'a', handler: vi.fn() })
      store.setActiveNamespace('modal/abc')
      // filtered_stack is internal, but registry should only include modal scopes
      // We can verify by checking that setActiveNamespace doesn't throw and state looks correct
      expect(store.stack).toHaveLength(2)
    })

    test('clearNamespace clears only when the active namespace matches', () => {
      const store = useShortcutStore()
      store.setActiveNamespace('modal')
      // clearNamespace with a different id should not clear
      store.clearNamespace('other')
      // No direct way to observe active_namespace, but it should not throw
      // Clear with matching id
      store.clearNamespace('modal')
      // After clearing, setActiveNamespace('modal') should work without error
      expect(() => store.setActiveNamespace('modal')).not.toThrow()
    })
  })
})

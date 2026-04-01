import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { useStorage } from '@/composables/use-storage'

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('set stores value in localStorage', () => {
    const { set } = useStorage()
    set('my-key', 'hello')
    expect(localStorage.getItem('my-key')).toBe('hello')
  })

  test('get retrieves stored value', () => {
    localStorage.setItem('my-key', 'world')
    const { get } = useStorage()
    expect(get('my-key')).toBe('world')
  })

  test('get returns undefined for missing key', () => {
    const { get } = useStorage()
    expect(get('nonexistent')).toBeNull()
  })

  test('set overwrites existing value', () => {
    const { set, get } = useStorage()
    set('key', 'first')
    set('key', 'second')
    expect(get('key')).toBe('second')
  })
})

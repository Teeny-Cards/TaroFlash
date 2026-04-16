import { describe, test, expect, beforeEach } from 'vite-plus/test'
import storage from '@/utils/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('set stores value in localStorage', () => {
    storage.set('my-key', 'hello')
    expect(localStorage.getItem('my-key')).toBe('hello')
  })

  test('get retrieves stored value', () => {
    localStorage.setItem('my-key', 'world')
    expect(storage.get('my-key')).toBe('world')
  })

  test('get returns null for missing key', () => {
    expect(storage.get('nonexistent')).toBeNull()
  })

  test('set overwrites existing value', () => {
    storage.set('key', 'first')
    storage.set('key', 'second')
    expect(storage.get('key')).toBe('second')
  })
})

import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { clearStaticLoader } from '@/utils/static-loader'

describe('clearStaticLoader', () => {
  beforeEach(() => {
    document.body.style.background = 'rgb(0, 0, 0)'
    const script = document.createElement('script')
    script.id = 'static-loader-script'
    document.body.appendChild(script)
  })

  test('removes the inline background style from body', () => {
    clearStaticLoader()
    expect(document.body.style.getPropertyValue('background')).toBe('')
  })

  test('removes the static-loader-script element', () => {
    clearStaticLoader()
    expect(document.getElementById('static-loader-script')).toBeNull()
  })

  test('is idempotent — second call does not throw', () => {
    clearStaticLoader()
    expect(() => clearStaticLoader()).not.toThrow()
  })

  test('handles missing script element gracefully', () => {
    document.getElementById('static-loader-script')?.remove()
    expect(() => clearStaticLoader()).not.toThrow()
  })

  test('handles body without inline background gracefully', () => {
    document.body.style.removeProperty('background')
    expect(() => clearStaticLoader()).not.toThrow()
  })
})

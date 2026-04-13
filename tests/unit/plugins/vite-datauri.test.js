import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { resolve } from 'node:path'
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import dataUriPlugin from '@/plugins/vite-datauri'

const TMP_DIR = resolve(__dirname, '__tmp_datauri__')
const TMP_WAV = resolve(TMP_DIR, 'test.wav')
const TMP_PNG = resolve(TMP_DIR, 'test.png')

describe('vite-datauri plugin', () => {
  let plugin
  let loadHook

  beforeEach(() => {
    mkdirSync(TMP_DIR, { recursive: true })
    writeFileSync(TMP_WAV, 'fakewav')
    writeFileSync(TMP_PNG, 'fakepng')

    plugin = dataUriPlugin()
    loadHook = plugin.load.bind({
      error: vi.fn((msg) => {
        throw new Error(msg)
      })
    })

    return () => {
      rmSync(TMP_DIR, { recursive: true, force: true })
    }
  })

  test('plugin has correct name and enforce', () => {
    expect(plugin.name).toBe('vite-datauri')
    expect(plugin.enforce).toBe('pre')
  })

  test('ignores IDs without ?datauri query', () => {
    expect(loadHook(TMP_WAV)).toBeUndefined()
    expect(loadHook(`${TMP_WAV}?url`)).toBeUndefined()
  })

  test('produces a valid data URI export for .wav', () => {
    const result = loadHook(`${TMP_WAV}?datauri`)
    const expected = Buffer.from('fakewav').toString('base64')
    expect(result).toBe(`export default "data:audio/wav;base64,${expected}"`)
  })

  test('produces a valid data URI export for .png', () => {
    const result = loadHook(`${TMP_PNG}?datauri`)
    const expected = Buffer.from('fakepng').toString('base64')
    expect(result).toBe(`export default "data:image/png;base64,${expected}"`)
  })

  test('handles &datauri in a compound query string', () => {
    const result = loadHook(`${TMP_WAV}?other&datauri`)
    expect(result).toContain('data:audio/wav;base64,')
  })

  test('throws for unsupported file types', () => {
    const txtFile = resolve(TMP_DIR, 'test.txt')
    writeFileSync(txtFile, 'hello')
    expect(() => loadHook(`${txtFile}?datauri`)).toThrow('unsupported file type ".txt"')
  })

  test('maps all supported MIME types', () => {
    const cases = [
      ['a.wav', 'audio/wav'],
      ['a.mp3', 'audio/mpeg'],
      ['a.ogg', 'audio/ogg'],
      ['a.png', 'image/png'],
      ['a.jpg', 'image/jpeg'],
      ['a.jpeg', 'image/jpeg'],
      ['a.svg', 'image/svg+xml'],
      ['a.webp', 'image/webp']
    ]

    for (const [filename, mime] of cases) {
      const path = resolve(TMP_DIR, filename)
      writeFileSync(path, 'x')
      const result = loadHook(`${path}?datauri`)
      expect(result).toContain(`data:${mime};base64,`)
    }
  })
})

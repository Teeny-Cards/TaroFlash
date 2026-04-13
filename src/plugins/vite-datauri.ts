import { readFileSync } from 'node:fs'
import { extname } from 'node:path'
import type { Plugin } from 'vite-plus'

const MIME_TYPES: Record<string, string> = {
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
}

const QUERY = 'datauri'

export default function dataUriPlugin(): Plugin {
  return {
    name: 'vite-datauri',
    enforce: 'pre',

    load(id) {
      if (!id.includes(`?${QUERY}`) && !id.includes(`&${QUERY}`)) return

      const filePath = id.replace(/\?.*$/, '')
      const ext = extname(filePath).toLowerCase()
      const mime = MIME_TYPES[ext]

      if (!mime) {
        this.error(`vite-datauri: unsupported file type "${ext}" for ${filePath}`)
        return
      }

      const data = readFileSync(filePath)
      const base64 = data.toString('base64')
      const dataUri = `data:${mime};base64,${base64}`

      return `export default ${JSON.stringify(dataUri)}`
    }
  }
}

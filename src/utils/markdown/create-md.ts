import MarkdownIt from 'markdown-it'
import { mdColor } from '@/utils/markdown/md-color'

export function createMd() {
  const md = new MarkdownIt({ breaks: true })

  md.use(mdColor, {
    allowed: ['blue-500', 'green-400', 'purple-500', 'pink-500', 'red-500', 'orange-500']
  })

  return md
}

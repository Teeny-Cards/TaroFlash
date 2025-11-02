// md-color.ts
import type MarkdownIt from 'markdown-it'
import type { Token } from 'markdown-it'

type Options = {
  allowed: string[]
}

export function mdColor(md: MarkdownIt, opts: Options) {
  const allowed = new Set(opts.allowed)
  const varPrefix = '--color-'

  function render(tokens: Token[], idx: number) {
    const t = tokens[idx]
    const c = t.attrGet('data-c')
    const bg = t.attrGet('data-bg')

    const styles: string[] = []
    if (c) styles.push(`color: var(${varPrefix}${c})`)
    if (bg) styles.push(`background-color: var(${varPrefix}${bg})`)
    const styleAttr = styles.length ? ` style="${styles.join('; ')}"` : ''

    return `<span class="md-color"${styleAttr}>`
  }

  md.renderer.rules['color_open'] = render
  md.renderer.rules['color_close'] = () => '</span>'

  md.inline.ruler.before('emphasis', 'color', (state, silent) => {
    const start = state.pos

    // Must start with {{
    if (
      state.src.charCodeAt(start) !== 0x7b /*{*/ ||
      state.src.charCodeAt(start + 1) !== 0x7b /*{*/
    )
      return false

    // Find the closing }}
    const close = state.src.indexOf('}}', start + 2)
    if (close === -1) return false

    // Split into "spec | text"
    const inner = state.src.slice(start + 2, close).trim()
    const bar = inner.indexOf('|')
    if (bar === -1) return false

    const spec = inner.slice(0, bar).trim()
    const text = inner.slice(bar + 1).trim()
    if (!text) return false
    if (silent) return false

    // Parse keys: c:<token> bg:<token>
    let c: string | null = null
    let bg: string | null = null
    for (const part of spec.split(/\s+/)) {
      const m = /^(c|color|bg):([a-z0-9-]+)$/i.exec(part)
      if (!m) continue
      const key = m[1].toLowerCase()
      const val = m[2].toLowerCase()
      if (!allowed.has(val)) continue // whitelist only
      if (key === 'bg') bg = val
      else c = val
    }

    // If neither c nor bg is valid, bail (treat as plain text)
    if (!c && !bg) return false

    // Build tokens
    const open = state.push('color_open', 'span', 1)
    if (c) open.attrSet('data-c', c)
    if (bg) open.attrSet('data-bg', bg)

    // Parse the inner text as inline markdown so **bold** still works
    const content = state.md.parseInline(text, state.env)
    // Push child tokens from content into current state
    // Easiest: parse inline using a temporary state
    const savedPos = state.pos
    const savedMax = state.posMax
    state.pos = start // temporarily replace source segment
    state.posMax = start
    // Use a child token container instead:
    const inline = state.push('inline', '', 0)
    inline.content = text
    inline.children = []
    state.md.inline.parse(text, state.md, state.env, inline.children)
    state.pos = savedPos
    state.posMax = savedMax

    state.push('color_close', 'span', -1)

    // Advance the cursor past }}
    state.pos = close + 2
    return true
  })
}

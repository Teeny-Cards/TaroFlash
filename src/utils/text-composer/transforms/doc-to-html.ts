import type { Doc, TextBlockType } from '../doc'

export function escapeHtml(s: string) {
  return (s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function tagForKind(kind: TextBlockType): string {
  if (kind === 'h1') return 'h1'
  if (kind === 'h2') return 'h2'
  if (kind === 'h3') return 'h3'
  return 'p'
}

/**
 * PURE: Doc -> HTML string
 * Note: we render list items like:
 * <li><h2>Text</h2></li> etc (no nested lists supported)
 */
export function docToHtml(doc: Doc): string {
  const out: string[] = []

  for (const b of doc.blocks) {
    if (b.type === 'text') {
      const tag = tagForKind(b.kind)
      if (!b.text) {
        out.push(`<${tag}><br/></${tag}>`)
      } else {
        out.push(`<${tag}>${escapeHtml(b.text)}</${tag}>`)
      }
      continue
    }

    if (b.type === 'hr') {
      out.push('<hr/>')
      continue
    }
  }

  if (out.length === 0) out.push('<p><br/></p>')
  return out.join('')
}

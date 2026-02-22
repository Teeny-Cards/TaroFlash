import type { Doc } from '../doc'
import {
  escapeText,
  trimRight,
  hashesFromKind,
  isBlankLine,
  parseHeadingLine,
  parseListItemLine,
  startState,
  flushParagraph,
  flushList,
  pushTextBlock,
  pushListItem,
  ensureAtLeastOneBlock
} from './utils'

/**
 * PURE: markdown-lite -> Doc
 * Supports:
 *  - #/##/### headings
 *  - paragraphs (multi-line)
 *  - unordered lists (-/*) with optional heading markers after "- "
 *    e.g. "- ### Title"
 */
export function parseMarkdownLite(md: string): Doc {
  const lines = escapeText(md).split('\n')
  const s = startState()

  for (const raw of lines) {
    const line = trimRight(raw)
    const trimmed = line.trim()

    if (isBlankLine(trimmed)) {
      pushTextBlock(s, 'p', '')
      // flushList(s)
      continue
    }

    const li = parseListItemLine(trimmed)
    if (li) {
      flushParagraph(s)
      // pushListItem(s, li)
      continue
    }

    const h = parseHeadingLine(trimmed)
    if (h) {
      flushParagraph(s)
      // flushList(s)
      pushTextBlock(s, h.kind, h.text)
      continue
    }

    // paragraph line
    // flushList(s)
    pushTextBlock(s, 'p', trimmed)
  }

  flushParagraph(s)
  // flushList(s)
  ensureAtLeastOneBlock(s)

  return { blocks: s.blocks }
}

/**
 * PURE: Doc -> markdown-lite
 */
export function serializeMarkdownLite(doc: Doc): string {
  const out: string[] = []

  for (const b of doc.blocks) {
    if (b.type === 'text') {
      const hashes = hashesFromKind(b.kind)
      if (hashes) {
        out.push(b.text ? `${hashes} ${b.text}` : '')
      } else {
        out.push(b.text ?? '')
      }
      continue
    }

    if (b.type === 'ul') {
      for (const item of b.items) {
        const hashes = hashesFromKind(item.kind)
        if (hashes) out.push(`- ${hashes} ${item.text}`)
        else out.push(`- ${item.text}`)
      }
      continue
    }
  }

  // trim trailing blank lines
  while (out.length && out[out.length - 1] === '') out.pop()

  return out.join('\n')
}

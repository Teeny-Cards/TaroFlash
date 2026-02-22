import type { Doc } from '../doc'
import {
  escapeText,
  trimRight,
  hashesFromKind,
  isBlankLine,
  parseHeadingLine,
  pushTextBlock,
  ensureAtLeastOneBlock,
  isHorizontalRuleLine,
  pushHorizontalRule
} from './utils'

/**
 * Parses a string of markdown into a Doc.
 * Supports:
 *  - #/##/### headings
 *  - paragraphs (multi-line)
 */
export function parse(md: string): Doc {
  const lines = escapeText(md).split('\n')
  const doc: Doc = { blocks: [] }

  for (const raw of lines) {
    const line = trimRight(raw)
    const trimmed = line.trim()

    if (isBlankLine(trimmed)) {
      pushTextBlock(doc, 'p', '')
      continue
    }

    if (isHorizontalRuleLine(trimmed)) {
      pushHorizontalRule(doc)
      continue
    }

    const h = parseHeadingLine(trimmed)
    if (h) {
      pushTextBlock(doc, h.kind, h.text)
      continue
    }

    pushTextBlock(doc, 'p', trimmed)
  }

  ensureAtLeastOneBlock(doc)

  return doc
}

/**
 * Serializes a Doc into a string of markdown.
 */
export function serialize(doc: Doc): string {
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

    if (b.type === 'hr') {
      out.push('---')
      continue
    }
  }

  // trim trailing blank lines
  while (out.length && out[out.length - 1] === '') out.pop()

  return out.join('\n')
}

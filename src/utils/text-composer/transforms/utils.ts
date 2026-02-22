import type { Doc, TextBlockType } from '../doc'

export type ParsedHeading = { kind: TextBlockType; text: string }

// ---------- text utilities ----------

/**
 * Escapes text by normalizing line endings from `\r\n` to `\n`.
 * @param s - The string to escape
 * @returns The string with all `\r\n` sequences replaced with `\n`
 */
export function escapeText(s: string) {
  return (s ?? '').replace(/\r\n/g, '\n')
}

/**
 * Removes trailing whitespace from a string.
 * @param s - The string to trim
 * @returns The string with trailing whitespace removed
 */
export function trimRight(s: string) {
  return s.replace(/\s+$/g, '')
}

/**
 * Converts markdown hash symbols to a text block type.
 * @param hashes - A string of hash symbols (e.g., '#', '##', '###')
 * @returns 'h1' for single hash, 'h2' for double hash, 'h3' for triple or more
 */
export function parseTextBlockKindFromHashes(hashes: string): TextBlockType {
  if (hashes.length === 1) return 'h1'
  if (hashes.length === 2) return 'h2'
  return 'h3'
}

/**
 * Converts a text block type to its corresponding markdown hash symbols.
 * @param kind - The text block type
 * @returns The hash string for headings ('h1', 'h2', 'h3'), or null for other types
 */
export function hashesFromKind(kind: TextBlockType): string | null {
  if (kind === 'h1') return '#'
  if (kind === 'h2') return '##'
  if (kind === 'h3') return '###'
  return null
}

/**
 * Checks if a trimmed line is blank (empty).
 * @param trimmed - The trimmed line to check
 * @returns True if the line is empty, false otherwise
 */
export function isBlankLine(trimmed: string) {
  return trimmed.length === 0
}

// must be exactly --- (optionally surrounded by spaces)
export function isHorizontalRuleLine(trimmed: string) {
  return /^---$/.test(trimmed)
}

/**
 * Parses a markdown heading line (e.g., "# Title", "## Subtitle").
 * @param trimmed - The trimmed line to parse
 * @returns An object with the heading kind and text, or null if not a heading
 */
export function parseHeadingLine(trimmed: string): ParsedHeading | null {
  const m = trimmed.match(/^(#{1,3})\s+(.*)$/)
  if (!m) return null
  return {
    kind: parseTextBlockKindFromHashes(m[1]),
    text: m[2].trim()
  }
}

/**
 * Adds a text block to the parse state.
 * @param s - The parse state to modify
 * @param kind - The type of text block (e.g., 'p', 'h1', 'h2', 'h3')
 * @param text - The text content of the block
 */
export function pushTextBlock(s: Doc, kind: TextBlockType, text: string) {
  s.blocks.push({ type: 'text', kind, text })
}

export function pushHorizontalRule(s: Doc) {
  s.blocks.push({ type: 'hr' })
}

/**
 * Ensures the parse state has at least one block.
 * Adds an empty paragraph block if no blocks exist.
 * @param s - The parse state to modify
 */
export function ensureAtLeastOneBlock(s: Doc) {
  if (s.blocks.length === 0) s.blocks.push({ type: 'text', kind: 'p', text: '' })
}

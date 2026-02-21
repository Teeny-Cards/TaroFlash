import type { Doc, ListItem, TextBlockType } from '../doc'

export type ParsedHeading = { kind: TextBlockType; text: string }
export type ParsedListItem = { kind: TextBlockType; text: string }
export type ParseState = {
  blocks: Doc['blocks']
  paragraphLines: string[]
  listItems: ListItem[] | null
}

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

// ---------- line classifiers (small, focused) ----------

/**
 * Checks if a trimmed line is blank (empty).
 * @param trimmed - The trimmed line to check
 * @returns True if the line is empty, false otherwise
 */
export function isBlankLine(trimmed: string) {
  return trimmed.length === 0
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
 * Parses a markdown list item line (e.g., "- Item", "* Item").
 * Supports nested headings within list items.
 * @param trimmed - The trimmed line to parse
 * @returns An object with the item kind and text, or null if not a list item
 */
export function parseListItemLine(trimmed: string): ParsedListItem | null {
  const m = trimmed.match(/^[-*]\s+(.*)$/)
  if (!m) return null

  const body = m[1].trim()
  const headingInside = parseHeadingLine(body) // reuse heading parsing
  if (headingInside) return headingInside

  return { kind: 'p', text: body }
}

// ---------- state + flush helpers ----------

/**
 * Creates a new initial parse state for markdown parsing.
 * @returns A fresh ParseState with empty blocks, paragraph lines, and no list items
 */
export function startState(): ParseState {
  return { blocks: [], paragraphLines: [], listItems: null }
}

/**
 * Flushes accumulated paragraph lines into a text block.
 * Joins all paragraph lines with newlines and adds to blocks.
 * Preserves explicit blank paragraphs.
 * @param s - The parse state to modify
 */
export function flushParagraph(s: ParseState) {
  if (s.paragraphLines.length === 0) return

  const text = s.paragraphLines.join('\n').trim()

  // preserve explicit blank paragraph (when paragraphLines existed but trimmed empty)
  s.blocks.push({ type: 'text', kind: 'p', text: text.length > 0 ? text : '' })
  s.paragraphLines = []
}

/**
 * Flushes accumulated list items into a list block.
 * Only creates a block if there are items to flush.
 * @param s - The parse state to modify
 */
export function flushList(s: ParseState) {
  if (s.listItems && s.listItems.length > 0) {
    s.blocks.push({ type: 'ul', items: s.listItems })
  }
  s.listItems = null
}

/**
 * Adds a text block to the parse state.
 * @param s - The parse state to modify
 * @param kind - The type of text block (e.g., 'p', 'h1', 'h2', 'h3')
 * @param text - The text content of the block
 */
export function pushTextBlock(s: ParseState, kind: TextBlockType, text: string) {
  s.blocks.push({ type: 'text', kind, text })
}

/**
 * Adds a list item to the current list in the parse state.
 * Initializes the list array if it doesn't exist.
 * @param s - The parse state to modify
 * @param item - The list item to add
 */
export function pushListItem(s: ParseState, item: ListItem) {
  if (!s.listItems) s.listItems = []
  s.listItems.push(item)
}

/**
 * Ensures the parse state has at least one block.
 * Adds an empty paragraph block if no blocks exist.
 * @param s - The parse state to modify
 */
export function ensureAtLeastOneBlock(s: ParseState) {
  if (s.blocks.length === 0) s.blocks.push({ type: 'text', kind: 'p', text: '' })
}

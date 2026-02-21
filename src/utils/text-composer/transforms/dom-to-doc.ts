import type { Doc, ListItem, TextBlockType } from '../doc'

function normalizeText(s: string) {
  return (s ?? '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim()
}

function textFromEl(el: Element): string {
  return normalizeText(el.textContent ?? '')
}

function kindFromTag(tag: string): TextBlockType | null {
  if (tag === 'P') return 'p'
  if (tag === 'H1') return 'h1'
  if (tag === 'H2') return 'h2'
  if (tag === 'H3') return 'h3'
  return null
}

function firstTextBlockChild(li: HTMLElement): HTMLElement | null {
  // We only support a single text-block element inside LI (p/h1/h2/h3), no nested lists.
  const child = Array.from(li.children).find((c) => {
    const k = kindFromTag((c as HTMLElement).tagName)
    return !!k
  })
  return (child as HTMLElement) ?? null
}

export function domToDoc(root: HTMLElement): Doc {
  const blocks: Doc['blocks'] = []
  const children = Array.from(root.children) as HTMLElement[]

  for (const child of children) {
    const tag = child.tagName

    // UL
    if (tag === 'UL') {
      const items: ListItem[] = []
      const lis = Array.from(child.querySelectorAll(':scope > li')) as HTMLElement[]
      for (const li of lis) {
        const textBlock = firstTextBlockChild(li)
        if (textBlock) {
          const kind = kindFromTag(textBlock.tagName) ?? 'p'
          items.push({ kind, text: textFromEl(textBlock) })
        } else {
          // fallback: direct text
          const t = normalizeText(li.textContent ?? '')
          items.push({ kind: 'p', text: t })
        }
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // P/H1/H2/H3
    const kind = kindFromTag(tag)
    if (kind) {
      blocks.push({ type: 'text', kind, text: textFromEl(child) })
      continue
    }

    // unexpected -> paragraph fallback
    blocks.push({ type: 'text', kind: 'p', text: normalizeText(child.textContent ?? '') })
  }

  if (blocks.length === 0) blocks.push({ type: 'text', kind: 'p', text: '' })
  return { blocks }
}

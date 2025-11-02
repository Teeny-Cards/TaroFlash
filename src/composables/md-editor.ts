import { shallowRef, reactive, readonly } from 'vue'
import { createTurndown, createMd } from '@/utils/markdown'

const TOOLBAR_HIDE_DELAY = 10

type Target = HTMLElement | null
type Block = 'paragraph' | 'h1' | 'h2' | 'h3' | 'mixed'
type Align = 'left' | 'center' | 'right' | 'justify'
const BLOCK_TAG = /^(P|H1|H2|H3|DIV)$/

const md = createMd()
const td = createTurndown()
let hideTimer: number | null = null
let selFrame = 0

const activeEl = shallowRef<Target>(null)
const ctxState = reactive({
  block: 'paragraph' as Block,
  align: 'left' as Align,
  bold: false,
  italic: false,
  link: false,
  color: null as string | null, // from data-c
  bg: null as string | null // from data-bg
})

export function useMdEditor() {
  function deserialize(md_text: string) {
    return md.render(md_text)
  }

  function serialize(html: string) {
    return td.turndown(html)
  }

  function setActive(el: Target) {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }

    if (el && !activeEl.value) {
      document.addEventListener('selectionchange', onSelectionChange, { passive: true })
    } else if (!el && activeEl.value) {
      document.removeEventListener('selectionchange', onSelectionChange)
    }
    activeEl.value = el
    // immediate compute when activating
    if (el) updateContext()
  }

  function deferDeactivate(expectedEl: HTMLElement | null, delay = TOOLBAR_HIDE_DELAY) {
    if (hideTimer) clearTimeout(hideTimer)

    hideTimer = window.setTimeout(() => {
      // Only clear if nobody else claimed active in the meantime
      if (activeEl.value === expectedEl) activeEl.value = null
      hideTimer = null
    }, delay)
  }

  function getRange(): Range | null {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    const range = sel.getRangeAt(0)

    if (!activeEl.value?.contains(range.commonAncestorContainer)) return null
    return range
  }

  function wrapInline(tag: 'strong' | 'em' | 'span' | 'a', attrs?: Record<string, string>) {
    const range = getRange()
    if (!range) return

    if (range.collapsed) {
      const placeholder = document.createTextNode('text')
      range.insertNode(placeholder)
      range.selectNode(placeholder)
    }

    const wrapper = document.createElement(tag)
    if (attrs) for (const [k, v] of Object.entries(attrs)) wrapper.setAttribute(k, v)

    try {
      wrapper.appendChild(range.extractContents())
    } catch {
      // Fallback if selection contains partial tags: wrap via surroundContents if possible
      try {
        range.surroundContents(wrapper)
        return
      } catch {
        /* ignore */
      }
    }
    range.insertNode(wrapper)

    // place caret after wrapper
    const sel = window.getSelection()!
    sel.removeAllRanges()
    const r = new Range()
    r.setStartAfter(wrapper)
    r.collapse(true)
    sel.addRange(r)
  }

  function retagBlock(tag: 'p' | 'h1' | 'h2' | 'h3') {
    const el = activeEl.value
    const range = getRange()
    if (!el || !range) return

    const block = findBlock(el, range.startContainer)

    if (block.tagName === tag) return block
    const next = document.createElement(tag)
    // copy attributes (id/class/data-*, align marker, etc.)
    for (const { name, value } of Array.from(block.attributes)) {
      next.setAttribute(name, value)
    }
    // move children (avoid innerHTML to keep live nodes/listeners)
    while (block.firstChild) next.appendChild(block.firstChild)
    block.replaceWith(next)
    return next
  }

  function setBlock(tag: 'div' | 'p' | 'h1' | 'h2' | 'h3', attrs?: Record<string, string>) {
    const el = activeEl.value
    const range = getRange()
    if (!el || !range) return
    let node: Node | null = range.startContainer
    while (
      node &&
      node !== el &&
      !(node instanceof HTMLElement && /^(P|H1|H2|H3|DIV)$/.test(node.tagName))
    ) {
      node = node.parentNode
    }
    const block = (node as HTMLElement) || el
    const wrapper = document.createElement(tag)
    if (attrs) for (const [k, v] of Object.entries(attrs)) wrapper.setAttribute(k, v)
    wrapper.innerHTML = block.outerHTML
    block.replaceWith(wrapper)
  }

  function findBlock(root: HTMLElement, from: Node): HTMLElement {
    let n: Node | null = from
    while (n && n !== root) {
      if (n instanceof HTMLElement && BLOCK_TAG.test(n.tagName)) return n
      n = n.parentNode
    }
    return root
  }

  function color({ c, bg }: { c?: string; bg?: string }) {
    const attrs: { [key: string]: string } = {}

    if (c) attrs['data-c'] = c
    if (bg) attrs['data-bg'] = bg

    wrapInline('span', attrs)
  }

  function updateContext() {
    if (!activeEl.value) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    if (!activeEl.value.contains(range.commonAncestorContainer)) return

    // Helper: climb ancestors
    const ancestors: Element[] = []
    let node: Node | null = range.startContainer
    while (node && node !== activeEl.value) {
      if (node instanceof Element) ancestors.push(node)
      node = node.parentNode
    }

    // Block type (consider multi-block selection)
    const blockTags = ['P', 'H1', 'H2', 'H3', 'DIV']
    function findBlock(n: Node): HTMLElement | null {
      let cur: Node | null = n
      while (cur && cur !== activeEl.value) {
        if (cur instanceof HTMLElement && blockTags.includes(cur.tagName)) return cur
        cur = cur.parentNode
      }
      return null
    }
    const startBlock = findBlock(range.startContainer)
    const endBlock = findBlock(range.endContainer)
    let block: Block = 'paragraph'
    if (!startBlock || !endBlock) block = 'paragraph'
    else if (startBlock !== endBlock) block = 'mixed'
    else {
      const tag = startBlock.tagName
      block = tag === 'H1' ? 'h1' : tag === 'H2' ? 'h2' : tag === 'H3' ? 'h3' : 'paragraph'
    }

    // Alignment from closest block/div[data-align]
    let align: Align = 'left'
    const alignHost = startBlock ?? ancestors.find((a: any) => a.dataset.align)
    if (alignHost) {
      const a = (alignHost as HTMLElement).dataset.align as Align | undefined
      if (a) align = a
      else if (/^(H1|H2|H3|P)$/.test(alignHost.tagName)) {
        const cs = getComputedStyle(alignHost)
        align = (cs.textAlign as Align) ?? 'left'
        if (!['left', 'center', 'right', 'justify'].includes(String(align))) align = 'left'
      }
    }

    // Inline marks from ancestors
    const has = (tag: string) => ancestors.some((a) => a.tagName === tag)
    const colorSpan = ancestors.find(
      (a) => a.tagName === 'SPAN' && (a.hasAttribute('data-c') || a.hasAttribute('data-bg'))
    )

    ctxState.block = block
    ctxState.align = align
    ctxState.bold = has('STRONG') || ancestors.some((a) => a.tagName === 'B')
    ctxState.italic = has('EM') || ancestors.some((a) => a.tagName === 'I')
    ctxState.link = has('A')
    ctxState.color = colorSpan?.getAttribute('data-c') ?? null
    ctxState.bg = colorSpan?.getAttribute('data-bg') ?? null
  }

  function onSelectionChange() {
    // throttle to next frame
    if (selFrame) cancelAnimationFrame(selFrame)
    selFrame = requestAnimationFrame(() => {
      selFrame = 0
      if (activeEl.value) updateContext()
    })
  }

  return {
    activeEl,
    context: readonly(ctxState),
    deserialize,
    serialize,
    setActive,
    deferDeactivate,
    bold: () => wrapInline('strong'),
    italic: () => wrapInline('em'),
    align: (dir: Align) => setBlock('div', { 'data-align': dir }),
    header: (heading: 'h1' | 'h2' | 'h3' | 'p') => retagBlock(heading),
    link: (url?: string) => wrapInline('a', { href: url ?? '' }),
    color
  }
}

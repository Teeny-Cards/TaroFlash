import TurndownService from 'turndown'

export function createTurndown() {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

  // span[data-c/bg] → custom inline syntax
  td.addRule('inlineColor', {
    filter: (node) =>
      (node.nodeName === 'SPAN' && (node as Element).hasAttribute('data-c')) ||
      (node as Element).hasAttribute('data-bg'),
    replacement: (content, node) => {
      const el = node as Element
      const c = el.getAttribute('data-c')
      const bg = el.getAttribute('data-bg')
      const parts: string[] = []

      if (c) parts.push(`c:${c}`)
      if (bg) parts.push(`bg:${bg}`)

      return `{{ ${parts.join(' ')} | ${content} }}`
    }
  })

  // div[data-align] → block container
  td.addRule('blockAlign', {
    filter: (node) => node.nodeName === 'DIV' && (node as Element).hasAttribute('data-align'),
    replacement: (content, node) => {
      const dir = (node as Element).getAttribute('data-align') || 'left'
      return `\n::: align=${dir}\n${content}\n:::\n`
    }
  })

  // strong/em are default; links default.

  return td
}

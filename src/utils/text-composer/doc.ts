export type HeadingLevel = 1 | 2 | 3
export type TextBlockType = 'p' | 'h1' | 'h2' | 'h3'

export type Doc = {
  blocks: Block[]
}

export type Block =
  | { type: 'text'; kind: TextBlockType; text: string }
  | { type: 'ul'; items: ListItem[] }

export type ListItem = {
  kind: TextBlockType // allow p/h1/h2/h3 INSIDE the list item
  text: string
}

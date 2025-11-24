import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed') as any

export class DividerBlot extends BlockEmbed {
  static blotName = 'divider'
  static tagName = 'hr'
}

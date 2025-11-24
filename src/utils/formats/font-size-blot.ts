import Quill from 'quill'

const size = Quill.import('attributors/style/size') as any

size.whitelist = null

export const FontSizeBlot = size

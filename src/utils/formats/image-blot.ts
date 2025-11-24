import Quill from 'quill'

const ImageFormat = Quill.import('formats/image') as any

export type ImageValue = {
  id: string
  url: string
}

export class ImageBlot extends ImageFormat {
  static blotName = 'image'
  static tagName = 'span'
  static className = 'ql-image'

  onDelete: null | ((id: string) => void) = null

  static create(value: ImageValue) {
    const node = super.create() as HTMLElement

    const img = document.createElement('img')
    img.src = value.url
    img.setAttribute('data-image-id', value.id || '')

    const btn = document.createElement('button')
    btn.type = 'button'

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const id = img.getAttribute('data-image-id') || ''

      const blot = Quill.find(node) as ImageBlot | null
      if (blot) {
        blot.scroll.emitter.emit('image-delete', id)
        blot.remove()
      }
    })

    node.appendChild(img)
    node.appendChild(btn)

    return node
  }

  static value(node: HTMLElement): ImageValue {
    const img = node.querySelector('img')
    return {
      id: img?.getAttribute('data-image-id') || '',
      url: img?.getAttribute('src') || ''
    }
  }

  deleteAt(index: number, length: number) {
    // super.deleteAt(index, length)
    return
  }
}

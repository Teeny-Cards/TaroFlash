import { ref, markRaw } from 'vue'

type ModalEntry = {
  backdrop?: boolean
  closeOnBackdropClick?: boolean
  component: any
  componentProps?: Record<string, any>
  resolve: (result: boolean) => void
  id: symbol
}

type OpenArgs = {
  component: any
  props?: Record<string, any>
  backdrop?: boolean
  closeOnBackdropClick?: boolean
}

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open(args: OpenArgs) {
    let resolveFn!: (result: boolean) => void

    const id = Symbol('modal')
    const response = new Promise<boolean>((resolve) => {
      resolveFn = resolve
    })

    const close = (responseValue: boolean = false) => {
      const index = modal_stack.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        modal_stack.value[index].resolve(responseValue)
        modal_stack.value.splice(index, 1)
      }
    }

    const entry: ModalEntry = {
      backdrop: args.backdrop ?? false,
      closeOnBackdropClick: args.closeOnBackdropClick ?? true,
      id,
      component: markRaw(args.component),
      componentProps: {
        ...args.props,
        close
      },
      resolve: resolveFn
    }

    modal_stack.value.push(entry)

    return {
      id,
      close,
      response
    }
  }

  function close(id?: symbol, response: boolean = false) {
    let index = modal_stack.value.findIndex((m) => m.id === id)
    index = index === -1 ? modal_stack.value.length - 1 : index

    if (index !== -1 && modal_stack.value[index].closeOnBackdropClick) {
      const modal = modal_stack.value[index]
      modal.resolve(response)
      modal_stack.value.splice(index, 1)
    }
  }

  return { open, close, modal_stack }
}

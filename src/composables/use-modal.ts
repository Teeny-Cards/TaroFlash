import { ref, markRaw } from 'vue'
import { useAudio } from './use-audio'

type ModalEntry = {
  backdrop?: boolean
  closeOnBackdropClick?: boolean
  component: any
  componentProps?: Record<string, any>
  id: symbol
  openAudio?: string
  closeAudio?: string
  resolve: (result: any) => void
  close: (responseValue?: any) => void
}

type OpenArgs = {
  props?: Record<string, any>
  backdrop?: boolean
  closeOnBackdropClick?: boolean
  openAudio?: string
  closeAudio?: string
}

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open(component: any, args: OpenArgs): Promise<any> {
    let resolveFn!: (result: any) => void

    const id = Symbol('modal')
    const response = new Promise<any>((resolve) => {
      resolveFn = resolve
    })

    const close = (
      responseValue: boolean = false,
      close_args?: { overrideCloseAudio?: string }
    ) => {
      const index = modal_stack.value.findIndex((m) => m.id === id)

      if (index !== -1) {
        modal_stack.value[index].resolve(responseValue)
        modal_stack.value.splice(index, 1)

        if (close_args?.overrideCloseAudio || args.closeAudio) {
          useAudio().play(
            close_args?.overrideCloseAudio ? close_args?.overrideCloseAudio : args.closeAudio!
          )
        }
      }
    }

    const entry: ModalEntry = {
      backdrop: args.backdrop ?? false,
      closeOnBackdropClick: args.closeOnBackdropClick ?? true,
      id,
      component: markRaw(component),
      componentProps: {
        ...args.props,
        close
      },
      resolve: resolveFn,
      close,
      openAudio: args.openAudio,
      closeAudio: args.closeAudio
    }

    modal_stack.value.push(entry)

    if (args.openAudio) {
      useAudio().play(args.openAudio)
    }

    return response
  }

  function close(id?: symbol, response: boolean = false) {
    let index = modal_stack.value.findIndex((m) => m.id === id)
    index = index === -1 ? modal_stack.value.length - 1 : index

    if (index !== -1 && modal_stack.value[index].closeOnBackdropClick) {
      const modal = modal_stack.value[index]
      modal.resolve(response)
      modal_stack.value.splice(index, 1)
      if (modal.closeAudio) {
        useAudio().play(modal.closeAudio)
      }
    }
  }

  return { open, close, modal_stack }
}

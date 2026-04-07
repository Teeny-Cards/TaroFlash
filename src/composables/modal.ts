import { ref, markRaw } from 'vue'
import uid from '@/utils/uid'

type ModalEntry = {
  backdrop?: boolean
  component: any
  componentProps?: Record<string, any>
  id: string
  resolve: (result?: any) => void
}

type OpenArgs = {
  props?: Record<string, any>
  backdrop?: boolean
}

export type ModalCloseFn = (responseValue?: any) => void

export type OpenModalResult = {
  response: Promise<any>
  close: ModalCloseFn
}

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open(component: any, args?: OpenArgs): OpenModalResult {
    let resolveFn!: (result: any) => void

    const id = uid()
    const response = new Promise<any>((resolve) => {
      resolveFn = resolve
    })

    const closeFunc: ModalCloseFn = (responseValue?: any) => {
      resolveFn(responseValue)
      close(id)
    }

    const entry: ModalEntry = {
      backdrop: args?.backdrop ?? false,
      id,
      component: markRaw(component),
      componentProps: {
        ...args?.props,
        close: closeFunc
      },
      resolve: resolveFn
    }

    modal_stack.value.push(entry)

    return {
      response,
      close: closeFunc
    }
  }

  function close(id: string) {
    const index = modal_stack.value.findIndex((m) => m.id === id)
    if (index === -1) return

    modal_stack.value[index].resolve()
    modal_stack.value.splice(index, 1)
  }

  function pop() {
    const top = modal_stack.value.at(-1)
    if (top) close(top.id)
  }

  return { open, pop, modal_stack }
}

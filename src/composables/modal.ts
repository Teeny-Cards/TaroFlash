import { ref, markRaw } from 'vue'
import uid from '@/utils/uid'

export type ModalMode = 'dialog' | 'mobile-sheet' | 'popup'

type ModalEntry = {
  backdrop?: boolean
  component: any
  componentProps?: Record<string, any>
  mode: ModalMode
  id: string
  resolve: (result?: any) => void
}

type OpenArgs = {
  props?: Record<string, any>
  backdrop?: boolean
  mode?: ModalMode
}

export type ModalCloseFn<T> = (responseValue?: T) => void

export type OpenModalResult<T = unknown> = {
  response: Promise<T>
  close: ModalCloseFn<T>
}

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open<T>(component: any, args?: OpenArgs): OpenModalResult<T> {
    let resolveFn!: (result: T) => void

    const id = uid()
    const response = new Promise<T>((resolve) => {
      resolveFn = resolve
    })

    const closeFunc: ModalCloseFn<T> = (responseValue?: T) => {
      resolveFn(responseValue as T)
      close(id)
    }

    const entry: ModalEntry = {
      backdrop: args?.backdrop ?? false,
      mode: args?.mode ?? 'dialog',
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

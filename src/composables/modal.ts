import { ref, markRaw, inject, onUnmounted, type InjectionKey } from 'vue'
import uid from '@/utils/uid'

/** Provided by modal-slot.vue so any descendant can identify which modal it lives in. */
export const MODAL_ID_KEY: InjectionKey<string> = Symbol('modalId')

/** Handlers registered via useModalRequestClose, keyed by modal id. */
const request_close_handlers = new Map<string, () => void>()

/**
 * Call this inside any component that lives inside a modal to register a handler
 * that runs when the backdrop is clicked or esc is pressed.
 * The handler is responsible for deciding whether/how to actually close by calling
 * the close function passed as a prop.
 */
export function useModalRequestClose(handler: () => void) {
  const id = inject(MODAL_ID_KEY)
  if (!id) return

  request_close_handlers.set(id, handler)
  onUnmounted(() => request_close_handlers.delete(id))
}

export { request_close_handlers }

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

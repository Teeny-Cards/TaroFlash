import { ref, markRaw } from 'vue'
import { useAudio } from './audio'
import { useShortcuts } from './use-shortcuts'
import uid from '@/utils/uid'

type ModalEntry = {
  backdrop?: boolean
  global_close?: boolean
  component: any
  componentProps?: Record<string, any>
  id: string
  openAudio?: string
  closeAudio?: string
  resolve: (result: any) => void
  close: (responseValue?: any) => void
}

type OpenArgs = {
  props?: Record<string, any>
  backdrop?: boolean
  global_close?: boolean
  openAudio?: string
  closeAudio?: string
}

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open<T = any>(component: any, args?: OpenArgs): Promise<T | boolean> {
    let resolveFn!: (result: any) => void

    const id = uid()
    const response = new Promise<any>((resolve) => {
      resolveFn = resolve
    })

    const close = (responseValue: any, close_args?: { overrideCloseAudio?: string }) => {
      const index = modal_stack.value.findIndex((m) => m.id === id)

      if (index !== -1) {
        modal_stack.value[index].resolve(responseValue)
        modal_stack.value.splice(index, 1)
        useShortcuts(`modal/${id}`).clearScope()

        if (close_args?.overrideCloseAudio || args?.closeAudio) {
          useAudio().play(
            close_args?.overrideCloseAudio ? close_args?.overrideCloseAudio : args?.closeAudio!
          )
        }
      }
    }

    const entry: ModalEntry = {
      backdrop: args?.backdrop ?? false,
      global_close: args?.global_close ?? true,
      id,
      component: markRaw(component),
      componentProps: {
        ...args?.props,
        close
      },
      resolve: resolveFn,
      close,
      openAudio: args?.openAudio,
      closeAudio: args?.closeAudio
    }

    useShortcuts(`modal/${id}`).registerShortcut({
      id: 'close-modal',
      combo: 'esc',
      description: 'Close Modal',
      handler: () => close(false)
    })

    modal_stack.value.push(entry)

    if (args?.openAudio) {
      useAudio().play(args?.openAudio)
    }

    return response
  }

  function close(id?: string, response: boolean = false) {
    let index = modal_stack.value.findIndex((m) => m.id === id)
    index = index === -1 ? modal_stack.value.length - 1 : index

    if (index !== -1 && modal_stack.value[index].global_close) {
      const modal = modal_stack.value[index]
      modal.resolve(response)
      modal_stack.value.splice(index, 1)
      useShortcuts(`modal/${modal.id}`).clearScope()

      if (modal.closeAudio) {
        useAudio().play(modal.closeAudio)
      }
    }
  }

  return { open, close, modal_stack }
}

import { ref, markRaw } from 'vue'
import { emitSfx } from '@/sfx/bus'
import { useShortcuts } from './use-shortcuts'
import uid from '@/utils/uid'
import { type NamespacedAudioKey } from '@/sfx/config'

type ModalEntry = {
  backdrop?: boolean
  global_close?: boolean
  component: any
  componentProps?: Record<string, any>
  id: string
  openAudio?: NamespacedAudioKey
  closeAudio?: NamespacedAudioKey
  resolve: (result?: any) => void
  shortcutDispose: () => void
  shortcutClearScope: () => void
}

type OpenArgs = {
  props?: Record<string, any>
  backdrop?: boolean
  global_close?: boolean
  openAudio?: NamespacedAudioKey
  closeAudio?: NamespacedAudioKey
}

type closeOpts = {
  override_close_audio?: NamespacedAudioKey
}

export type ModalCloseFn = (responseValue?: any, opts?: closeOpts) => void

const modal_stack = ref<ModalEntry[]>([])

export function useModal() {
  function open<T = any>(
    component: any,
    args?: OpenArgs
  ): { response: Promise<T>; close: ModalCloseFn } {
    let resolveFn!: (result: any) => void

    const id = uid()
    const shortcuts = useShortcuts(`modal/${id}`)
    const response = new Promise<any>((resolve) => {
      resolveFn = resolve
    })

    const closeFunc = (responseValue?: any, opts?: closeOpts) => {
      resolveFn(responseValue)
      close(id, opts)
    }

    const entry: ModalEntry = {
      backdrop: args?.backdrop ?? false,
      global_close: args?.global_close ?? true,
      id,
      component: markRaw(component),
      componentProps: {
        ...args?.props,
        close: closeFunc
      },
      resolve: resolveFn,
      openAudio: args?.openAudio,
      closeAudio: args?.closeAudio,
      shortcutDispose: shortcuts.dispose,
      shortcutClearScope: shortcuts.clearScope
    }

    shortcuts.register({
      combo: 'esc',
      handler: (_ev) => closeFunc()
    })

    modal_stack.value.push(entry)

    if (args?.openAudio) {
      emitSfx(args?.openAudio)
    }

    return {
      response,
      close: closeFunc
    }
  }

  function close(id?: string, opts?: closeOpts) {
    let index = modal_stack.value.findIndex((m) => m.id === id)
    const modal = modal_stack.value[index]

    if (modal?.global_close) {
      modal.resolve()
      modal.shortcutDispose?.()
      modal.shortcutClearScope?.()

      modal_stack.value.splice(index, 1)

      const close_audio = opts?.override_close_audio ?? modal.closeAudio
      if (close_audio) {
        emitSfx(close_audio)
      }
    }
  }

  function pop() {
    const modal = modal_stack.value.pop()
    if (modal) {
      modal.resolve()
      modal.shortcutDispose?.()
      modal.shortcutClearScope?.()
    }
  }

  function clearStack() {
    modal_stack.value.forEach((m) => {
      m.resolve()
      m.shortcutDispose?.()
      m.shortcutClearScope?.()
    })

    modal_stack.value = []
  }

  return { open, close, pop, clearStack, modal_stack }
}

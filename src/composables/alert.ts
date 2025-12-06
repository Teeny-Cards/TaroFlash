import { useModal } from './modal'
import alert, { type AlertType } from '@/components/ui-kit/alert.vue'
import { type NamespacedAudioKey } from '@/composables/audio'

type AlertArgs = {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  backdrop?: boolean
  global_close?: boolean
  openAudio?: NamespacedAudioKey
  cancelAudio?: NamespacedAudioKey
  confirmAudio?: NamespacedAudioKey
}

export function useAlert() {
  const modal = useModal()

  function warn(args?: AlertArgs): { response: Promise<any>; close: any } {
    return _openAlert('warn', args)
  }

  function info(args?: AlertArgs): { response: Promise<any>; close: any } {
    return _openAlert('info', args)
  }

  function _openAlert(
    type: AlertType,
    args?: AlertArgs
  ): { response: Promise<boolean>; close: any } {
    const { backdrop, global_close, openAudio, ...props } = args ?? {}

    return modal.open<boolean>(alert, {
      backdrop: backdrop ?? true,
      global_close,
      props: { type, ...props },
      openAudio: openAudio ?? 'ui.etc_woodblock_stuck'
    })
  }

  return { warn, info }
}

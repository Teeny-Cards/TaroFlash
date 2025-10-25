import { useModal } from './modal'
import alert, { type AlertType } from '@/components/ui-kit/alert.vue'

type AlertArgs = {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  backdrop?: boolean
  closeOnBackdropClick?: boolean
  openAudio?: string
  cancelAudio?: string
  confirmAudio?: string
}

export function useAlert() {
  const modal = useModal()

  function warn(args?: AlertArgs): Promise<boolean> {
    return _openAlert('warn', args)
  }

  function info(args?: AlertArgs): Promise<boolean> {
    return _openAlert('info', args)
  }

  function _openAlert(type: AlertType, args?: AlertArgs): Promise<boolean> {
    const { backdrop, closeOnBackdropClick, openAudio, ...props } = args ?? {}

    return modal.open(alert, {
      backdrop: backdrop ?? true,
      closeOnBackdropClick: closeOnBackdropClick,
      props: { type, ...props },
      openAudio: openAudio ?? 'etc_woodblock_stuck'
    })
  }

  return { warn, info }
}

import { useModal } from './use-modal'
import alert, { type AlertType } from '@/components/ui-kit/alert.vue'

type AlertArgs = {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  backdrop?: boolean
  closeOnBackdropClick?: boolean
}

export function useAlert() {
  const modal = useModal()

  function warn(args?: AlertArgs) {
    return _openAlert('warn', args)
  }

  function info(args?: AlertArgs) {
    return _openAlert('info', args)
  }

  function _openAlert(type: AlertType, args?: AlertArgs) {
    return modal.open(alert, {
      backdrop: args?.backdrop ?? true,
      closeOnBackdropClick: args?.closeOnBackdropClick,
      props: {
        type,
        title: args?.title,
        message: args?.message,
        confirmLabel: args?.confirmLabel,
        cancelLabel: args?.cancelLabel
      }
    })
  }

  return { warn, info }
}

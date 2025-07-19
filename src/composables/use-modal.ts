import confirmationAlert from '@/components/confirmation-alert.vue'
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

type AlertArgs = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  backdrop?: boolean
  closeOnBackdropClick?: boolean
}

const modalStack = ref<ModalEntry[]>([])

export function useModal() {
  function openAlertModal(args: AlertArgs) {
    const { title, message, confirmLabel, cancelLabel, backdrop, closeOnBackdropClick } = args

    const alert = openModal({
      component: confirmationAlert,
      backdrop,
      closeOnBackdropClick,
      props: {
        title,
        message,
        confirmLabel,
        cancelLabel
      }
    })

    return alert
  }

  function openModal(args: OpenArgs) {
    let resolveFn!: (result: boolean) => void

    const id = Symbol('modal')
    const result = new Promise<boolean>((resolve) => {
      resolveFn = resolve
    })

    const close = (resultValue: boolean = false) => {
      const index = modalStack.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        modalStack.value[index].resolve(resultValue)
        modalStack.value.splice(index, 1)
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

    modalStack.value.push(entry)

    return {
      id,
      close,
      result
    }
  }

  function closeModal(id?: symbol, result: boolean = false) {
    let index = modalStack.value.findIndex((m) => m.id === id)
    index = index === -1 ? modalStack.value.length - 1 : index

    if (index !== -1) {
      const modal = modalStack.value[index]
      modal.resolve(result)
      modalStack.value.splice(index, 1)
    }
  }

  return { openModal, closeModal, modalStack, openAlertModal }
}

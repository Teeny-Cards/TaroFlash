import generateUID from '@/utils/uid'
import { ref } from 'vue'

export type Toast = ToastOptions & {
  message: string
  state: 'success' | 'error' | 'warn' | 'info'
  id?: string
}

type ToastOptions = {
  subMessage?: string
  delay?: number
  persist?: boolean
}

const toasts = ref<Toast[]>([])
const defaultToast = {
  state: 'success',
  delay: 3000,
  persist: false,
  message: '',
  subMessage: '',
  id: ''
}

export function useToast() {
  function addToast(toast: Toast): void {
    const newToast = { ...defaultToast, ...toast, id: generateUID() }
    toasts.value.push(newToast)
  }

  function removeToast(toast: Toast): void {
    const index = toasts.value.findIndex((t) => t.id === toast.id)
    toasts.value.splice(index, 1)
  }

  function warn(message: string, options?: ToastOptions): void {
    addToast({ message, ...options, state: 'warn' })
  }

  function success(message: string, options?: ToastOptions): void {
    addToast({ message, ...options, state: 'success' })
  }

  function error(message: string, options?: ToastOptions): void {
    addToast({ message, ...options, state: 'error' })
  }

  function info(message: string, options?: ToastOptions): void {
    addToast({ message, ...options, state: 'info' })
  }

  return {
    toasts,
    removeToast,
    warn,
    success,
    error,
    info
  }
}

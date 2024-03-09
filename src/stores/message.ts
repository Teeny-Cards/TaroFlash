import { ref } from 'vue'
import { defineStore } from 'pinia'
import generateUID from '@/utils/uid'

export const useMessageStore = defineStore('message', () => {
  const toasts = ref<TeenyToast[]>([])

  const defaultToast: TeenyToast = {
    state: 'success',
    delay: 3000,
    persist: false,
    message: '',
    subMessage: '',
    id: ''
  }

  function addToast(toast: TeenyToast): void {
    const newToast = { ...defaultToast, ...toast, id: generateUID() }
    toasts.value.push(newToast)
  }

  function warn(
    message: string,
    options?: {
      subMessage?: string
      delay?: number
      persist?: boolean
    }
  ): void {
    addToast({ message, ...options, state: 'warn' })
  }

  function success(
    message: string,
    options?: {
      subMessage?: string
      delay?: number
      persist?: boolean
    }
  ): void {
    addToast({ message, ...options, state: 'success' })
  }

  function error(
    message: string,
    options?: {
      subMessage?: string
      delay?: number
      persist?: boolean
    }
  ): void {
    addToast({ message, ...options, state: 'error' })
  }

  function info(
    message: string,
    options?: {
      subMessage?: string
      delay?: number
      persist?: boolean
    }
  ): void {
    addToast({ message, ...options, state: 'info' })
  }

  function removeToast(toast: TeenyToast): void {
    const index = toasts.value.findIndex((t) => t.id === toast.id)
    toasts.value.splice(index, 1)
  }

  return { toasts, removeToast, warn, success, error, info }
})

import { defineStore } from 'pinia'
import generateUID from '@/utils/uid'

interface State {
  toasts: TeenyToast[]
  currentAlert: TeenyAlert | null
}

export const useMessageStore = defineStore('message', {
  state: (): State => ({
    toasts: [],
    currentAlert: null
  }),

  getters: {
    defaultToast: (): TeenyToast => ({
      state: 'success',
      delay: 3000,
      persist: false,
      message: '',
      subMessage: '',
      id: ''
    }),

    defaultAlert: (): TeenyAlert => ({
      title: '',
      message: '',
      actions: [{ label: 'Close', action: () => {} }],
      id: generateUID()
    })
  },

  actions: {
    alert(alert: TeenyAlert): void {
      const newAlert = { ...this.defaultAlert, ...alert }
      this.currentAlert = newAlert
    },

    removeAlert(): void {
      this.currentAlert = null
    },

    addToast(toast: TeenyToast): void {
      const newToast = { ...this.defaultToast, ...toast, id: generateUID() }
      this.toasts.push(newToast)
    },

    removeToast(toast: TeenyToast): void {
      const index = this.toasts.findIndex((t) => t.id === toast.id)
      this.toasts.splice(index, 1)
    },

    warn(
      message: string,
      options?: {
        subMessage?: string
        delay?: number
        persist?: boolean
      }
    ): void {
      this.addToast({ message, ...options, state: 'warn' })
    },

    success(
      message: string,
      options?: {
        subMessage?: string
        delay?: number
        persist?: boolean
      }
    ): void {
      this.addToast({ message, ...options, state: 'success' })
    },

    error(
      message: string,
      options?: {
        subMessage?: string
        delay?: number
        persist?: boolean
      }
    ): void {
      this.addToast({ message, ...options, state: 'error' })
    },

    info(
      message: string,
      options?: {
        subMessage?: string
        delay?: number
        persist?: boolean
      }
    ): void {
      this.addToast({ message, ...options, state: 'info' })
    }
  }
})

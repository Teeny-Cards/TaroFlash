import { ref } from 'vue'
import { defineStore } from 'pinia'
import generateUID from '@/utils/uid'

export const useToastStore = defineStore('toast', () => {
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

  function removeToast(toast: TeenyToast): void {
    const index = toasts.value.findIndex((t) => t.id === toast.id)
    toasts.value.splice(index, 1)
  }

  return { toasts, addToast, removeToast }
})

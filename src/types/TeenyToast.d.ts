declare global {
  type TeenyToast = {
    state?: 'info' | 'warn' | 'error' | 'success'
    delay?: number
    persist?: boolean
    message: string
    subMessage?: string
    id?: string
  }
}

export {}

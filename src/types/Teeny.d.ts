type TeenyToast = {
  state?: 'info' | 'warn' | 'error' | 'success'
  delay?: number
  persist?: boolean
  message: string
  subMessage?: string
  id?: string
}

type TeenyAlert = {
  title: string
  message: string
  actions?: [ButtonAction, ButtonAction?]
}

type TeenyButton = {
  label: string
  action: () => void
  variant?: string
  inverted?: boolean
  iconLeft?: string
  iconRight?: string
  iconOnly?: boolean
  size?: string
}

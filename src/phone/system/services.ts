import { useSessionStore } from '@/stores/session'

export function getServices() {
  const session = useSessionStore()

  return {
    auth: { logout: () => session.logout() }
  }
}

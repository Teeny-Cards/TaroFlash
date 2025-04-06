import { defineStore } from 'pinia'
import type { Session, User } from '@supabase/supabase-js'
import { getSession, login } from '@/services/sessionService'

export const useSessionStore = defineStore('session', {
  state: () => ({
    authenticated: false,
    user: null as User | null,
    loading: false
  }),

  actions: {
    async login(email: string, password: string): Promise<void> {
      const session = await login(email, password)
      this.authenticateUser(session)
    },

    async restoreSession(): Promise<void> {
      const session = await getSession()
      this.authenticateUser(session)
    },

    setLoading(value: boolean): void {
      this.loading = value
    },

    authenticateUser(session: Session | null): void {
      if (session?.user?.aud === 'authenticated') {
        this.authenticated = true
        this.user = session.user
      } else {
        this.authenticated = false
        this.user = null
      }
    }
  }
})

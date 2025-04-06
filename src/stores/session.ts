import { defineStore } from 'pinia'
import Logger from '@/utils/logger'
import type { Session, User } from '@supabase/supabase-js'
import { getSession, login } from '@/services/sessionService'

export const useSessionStore = defineStore('session', {
  state: () => ({
    authenticated: false,
    user: null as User | null,
    loading: false,
    hasLoadedOnce: false
  }),

  actions: {
    async login(email: string, password: string): Promise<void> {
      this.loading = true

      try {
        const session = await login(email, password)
        this.authenticateUser(session)

        this.loading = false
        this.hasLoadedOnce = true
      } catch (e: any) {
        Logger.error(`Error logging in: ${e.message}`)
        throw e
      }
    },

    async restoreSession(): Promise<void> {
      this.loading = true

      try {
        const session = await getSession()
        this.authenticateUser(session)

        this.loading = false
        this.hasLoadedOnce = true
      } catch (e: any) {
        Logger.error(`Error restoring session: ${e.message}`)
        throw e
      }
    },

    setLoading(value: boolean): void {
      Logger.debug(`Setting session loading state: ${value}`)
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

import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { getSession, login } from '@/services/sessionService'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: undefined as User | undefined,
    loading: false
  }),

  actions: {
    async login(email: string, password: string): Promise<void> {
      const session = await login(email, password)
      this.user = session?.user
    },

    async restoreSession(): Promise<void> {
      const session = await getSession()
      this.user = session?.user
    },

    setLoading(value: boolean): void {
      this.loading = value
    }
  },

  getters: {
    authenticated(state): boolean {
      return Boolean(state.user?.aud === 'authenticated')
    }
  }
})

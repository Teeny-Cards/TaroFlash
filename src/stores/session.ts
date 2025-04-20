import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { getSession, login } from '@/services/sessionService'

interface State {
  user: User | undefined
  loading: boolean
}

export const useSessionStore = defineStore('session', {
  state: (): State => ({
    user: undefined,
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
    authenticated({ user }): boolean {
      return Boolean(user?.aud === 'authenticated')
    }
  }
})

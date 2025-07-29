import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { getSession, login } from '@/services/session-service'

interface State {
  user: User | undefined
  loadingCount: number
}

export const useSessionStore = defineStore('session', {
  state: (): State => ({
    user: undefined,
    loadingCount: 0
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

    startLoading(): void {
      this.loadingCount++
    },

    stopLoading(): void {
      this.loadingCount--
    }
  },

  getters: {
    authenticated({ user }): boolean {
      return Boolean(user?.aud === 'authenticated')
    },

    isLoading({ loadingCount }): boolean {
      return loadingCount > 0
    },

    user_id({ user }): string | undefined {
      return user?.id
    }
  }
})

import { supabase } from '@/supabaseClient'
import { defineStore } from 'pinia'
import Logger from '@/utils/logger'
import type { User } from '@supabase/supabase-js'

export const useSessionStore = defineStore('session', {
  state: () => ({
    authenticated: false,
    user: null as User | null,
    loading: false,
    hasLoadedOnce: false
  }),

  actions: {
    async restoreSession(): Promise<void> {
      this.loading = true

      const { data, error } = await supabase.auth.getSession()

      if (data.session?.user?.aud === 'authenticated') {
        Logger.info('User authenticated')

        this.authenticated = true
        this.user = data.session.user
      } else {
        Logger.info('User not authenticated')

        this.authenticated = false
        this.user = null
      }

      this.loading = false
      this.hasLoadedOnce = true

      if (error) {
        Logger.error(`Login error: ${error.message}`)
        throw new Error(error.message)
      }
    },

    setLoading(value: boolean): void {
      Logger.debug(`Setting session loading state: ${value}`)
      this.loading = value
    }
  }
})

import { supabase } from '@/supabaseClient'
import { TeenyError } from '@/utils/TeenyError'
import type { User } from '@supabase/auth-js'
import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useMemberStore = defineStore('member', {
  state: () => ({
    username: '',
    email: '',
    id: '',
    authenticated: false
  }),

  actions: {
    async login(): Promise<void> {
      useAppStore().setLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw new TeenyError(error.message)
      }

      this.authenticated = data.session?.user.aud === 'authenticated'
      this.setUser(data.session?.user)
      useAppStore().setLoading(false)
    },

    setUser(newUser?: User): void {
      if (newUser) {
        this.email = newUser.email ?? ''
        this.id = newUser.id ?? ''
      } else {
        this.email = ''
        this.id = ''
      }
    }
  }
})

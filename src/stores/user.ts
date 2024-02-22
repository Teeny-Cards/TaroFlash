import { defineStore } from 'pinia'
import { handleUserAuthStateChange } from '@/services/userService'
import { useAppStore } from './app'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    id: ''
  }),

  getters: {
    authenticated: (state) => {
      return !!state.id
    }
  },

  actions: {
    async login(user: any): Promise<void> {
      const app = useAppStore()
      app.setLoading(true)

      try {
        const newUser = await handleUserAuthStateChange(user)
        this.setUser(newUser)
      } catch (e: any) {
        this.setUser()
      } finally {
        app.setLoading(false)
      }
    },

    setUser(newUser?: UserProfile): void {
      if (newUser) {
        this.username = newUser.username || ''
        this.email = newUser.email || ''
        this.id = newUser.userId || ''
      } else {
        this.username = ''
        this.email = ''
        this.id = ''
      }
    }
  }
})

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

      const response = await handleUserAuthStateChange(user)

      if (response.success) {
        this.setUser(response.value)
      } else {
        this.setUser()
      }

      app.setLoading(false)
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

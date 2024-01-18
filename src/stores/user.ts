import { defineStore } from 'pinia'
import { handleUserAuthStateChange } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    id: ''
  }),
  actions: {
    async login(user: any) {
      const response = await handleUserAuthStateChange(user)

      if (response.success) {
        this.setUser(response.value)
      } else {
        this.setUser()
      }
    },

    setUser(newUser?: UserProfile) {
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
  },
  getters: {
    authenticated: (state) => {
      return !!state.id
    }
  }
})

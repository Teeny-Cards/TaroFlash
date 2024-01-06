import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(false)
  const user = ref(null)

  function setAuthenticated() {
    authenticated.value = true
  }

  function setNotAuthenticated() {
    authenticated.value = false
  }

  function setUser(authenticatedUser: any) {
    user.value = authenticatedUser
  }

  return { authenticated, user, setAuthenticated, setNotAuthenticated, setUser }
})

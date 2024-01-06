import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(false)

  function setAuthenticated() {
    authenticated.value = false
  }

  function setNotAuthenticated() {
    authenticated.value = false
  }

  return { authenticated, setAuthenticated, setNotAuthenticated }
})

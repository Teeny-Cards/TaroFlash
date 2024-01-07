import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const email = ref('')
  const id = ref('')

  const authenticated = computed(() => !!id.value)

  function setUser(newUser?: UserProfile) {
    if (newUser) {
      username.value = newUser.username || ''
      email.value = newUser.email || ''
      id.value = newUser.userId || ''
    } else {
      username.value = ''
      email.value = ''
      id.value = ''
    }
  }

  return { authenticated, username, email, id, setUser }
})

import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    loading: false
  }),

  actions: {
    setLoading(value: boolean): void {
      this.loading = value
    }
  }
})

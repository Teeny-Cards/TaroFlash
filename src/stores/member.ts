import { fetchMemberById } from '@/services/memberService'
import { defineStore } from 'pinia'

export const useMemberStore = defineStore('member', {
  state: () => ({
    member: null as Member | null
  }),

  actions: {
    async fetchMember(user_id: string): Promise<void> {
      this.member = await fetchMemberById(user_id)
    }
  },

  getters: {
    id({ member }): string {
      return member?.id ?? ''
    },
    display_name({ member }): string {
      return member?.display_name ?? ''
    },
    created_at({ member }): string {
      return member?.created_at ?? ''
    },
    description({ member }): string {
      return member?.description ?? ''
    },
    num_decks({ member }): number {
      return member?.num_decks ?? 0
    }
  }
})

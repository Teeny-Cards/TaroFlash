import { fetchMemberById } from '@/api/members'
import { defineStore } from 'pinia'

interface State {
  member: Member | null
}

export const useMemberStore = defineStore('member', {
  state: (): State => ({
    member: null
  }),

  actions: {
    async fetchMember(user_id: string): Promise<void> {
      this.member = await fetchMemberById(user_id)
    }
  },

  getters: {
    has_member({ member }): boolean {
      return Boolean(member)
    },
    id({ member }): string | undefined {
      return member?.id
    },
    display_name({ member }): string {
      return member?.display_name ?? ''
    },
    created_at({ member }): string {
      return member?.created_at ?? ''
    },
    description({ member }): string {
      return member?.description ?? ''
    }
  }
})

import { fetchMemberById } from '@/api/members'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSessionStore } from './session'

export const useMemberStore = defineStore('member', () => {
  const member = ref<Member | null>(null)

  async function fetchMember(user_id: string): Promise<void> {
    if (user_id) {
      member.value = await fetchMemberById(user_id)
    }
  }

  const has_member = computed(() => Boolean(member.value))
  const id = computed(() => member.value?.id ?? '')
  const display_name = computed(() => member.value?.display_name ?? '')
  const created_at = computed(() => member.value?.created_at ?? '')
  const description = computed(() => member.value?.description ?? '')

  return {
    member,
    fetchMember,
    has_member,
    id,
    display_name,
    created_at,
    description
  }
})

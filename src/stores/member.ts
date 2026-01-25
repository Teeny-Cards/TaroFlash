import { fetchMemberById } from '@/api/members'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMemberStore = defineStore('member', () => {
  const display_name = ref<Member['display_name']>()
  const description = ref<Member['description']>()
  const theme = ref<Member['theme']>()
  const email = ref<Member['email']>()
  const created_at = ref<Member['created_at']>()
  const id = ref<Member['id']>()
  const avatar_url = ref<Member['avatar_url']>()
  const updated_at = ref<Member['updated_at']>()

  async function fetchMember(user_id: string): Promise<void> {
    const fetched_member = await fetchMemberById(user_id)
    if (!fetched_member) return

    display_name.value = fetched_member.display_name
    description.value = fetched_member.description
    theme.value = fetched_member.theme
    email.value = fetched_member.email
    created_at.value = fetched_member.created_at
    id.value = fetched_member.id
    avatar_url.value = fetched_member.avatar_url
    updated_at.value = fetched_member.updated_at
  }

  const has_member = computed(() => Boolean(id.value))

  return {
    fetchMember,
    has_member,
    display_name,
    description,
    theme,
    email,
    created_at,
    id,
    avatar_url,
    updated_at
  }
})

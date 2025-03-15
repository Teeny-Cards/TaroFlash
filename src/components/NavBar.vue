<template>
  <nav class="w-full bg-blue font-primary sticky top-0 z-10 flex justify-center px-4 py-3">
    <div class="w-full max-w-app flex justify-between items-center">
      <RouterLink to="/dashboard" class="text-2xl text-white">TeenyCards</RouterLink>
      <div class="flex gap-6 items-center">
        <RouterLink to="/create" class="text-white">Create</RouterLink>
        <TeenyDropdown>
          <template #trigger="{ toggle }">
            <TeenyButton inverted icon-left="user" @click="toggle">{{ display_name }}</TeenyButton>
          </template>
          <template #dropdown>
            <TeenyButton @click="member_card_open = true">Member Card</TeenyButton>
          </template>
        </TeenyDropdown>
      </div>
    </div>
  </nav>

  <TeenyModal :open="member_card_open" backdrop @close="member_card_open = false">
    <MemberCard />
  </TeenyModal>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import TeenyDropdown from './TeenyComponents/TeenyDropdown.vue'
import TeenyButton from './TeenyComponents/TeenyButton.vue'
import TeenyModal from './TeenyComponents/TeenyModal.vue'
import MemberCard from './MemberCard.vue'
import { ref } from 'vue'

defineProps({
  display_name: String
})

const member_card_open = ref(false)
</script>

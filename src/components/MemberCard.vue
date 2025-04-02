<template>
  <div
    member-card
    class="w-89 flex flex-col bg-parchment-dark rounded-8 shadow-modal overflow-hidden border-8 border-parchment-dark"
  >
    <div member-card__header class="flex items-center justify-center px-9 pt-6">
      <h1 class="text-4xl text-brown-dark">Member Card</h1>
    </div>
    <div
      member-card__body
      class="bg-green bg-(image:--bank-note-green-bg) bg-(length:--bg-sm) wave flex flex-col gap-6 pb-3 pt-9 px-8 items-center h-full"
    >
      <div member-card__avatar class="h-full flex flex-col justify-center">
        <div class="w-50 h-50 bg-parchment-dark rounded-19 border-parchment-dark border-10"></div>
      </div>
      <div
        class="w-full bg-parchment-dark rounded-1_5 text-brown-dark ring-8 ring-parchment-dark text-sm"
      >
        {{ description }}
      </div>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-col">
          <p class="text-lg text-brown-dark">{{ display_name }}</p>
          <div class="w-full h-0.25 bg-parchment-dark"></div>
          <p class="text-xs text-parchment-dark">MEMBER</p>
        </div>
        <div class="flex flex-col">
          <p class="text-lg text-brown-dark">Debut Deck Collector</p>
          <div class="w-full h-0.25 bg-parchment-dark"></div>
          <p class="text-xs text-parchment-dark">TITLE</p>
        </div>
      </div>

      <div
        member-card__registration
        class="flex justify-between align-center w-full text-brown-dark font-semibold text-xs"
      >
        <p>Reg. {{ created_on }}</p>
        <p>&lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt;</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMemberStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const memberStore = useMemberStore()
const { display_name, created_at, description } = storeToRefs(memberStore)

const created_on = computed(() => {
  var date = new Date(created_at.value)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})
</script>

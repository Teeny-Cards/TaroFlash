<template>
  <div member-card class="bg-brown-300 rounded-8 shadow-modal border-brown-300 flex w-89 flex-col overflow-hidden
      border-8">
    <div member-card__header class="flex items-center justify-center px-9 pt-6">
      <h1 class="text-brown-700 text-6xl">Member Card</h1>
    </div>
    <div member-card__body class="wave-top flex h-full flex-col items-center gap-6 bg-green-400 bg-(image:--bank-note-green-400-bg)
        bg-(length:--bg-sm) px-8 pt-9 pb-3">
      <div member-card__avatar class="flex h-full flex-col justify-center">
        <div class="bg-brown-300 rounded-19 border-brown-300 h-50 w-50 border-10"></div>
      </div>
      <div class="bg-brown-300 rounded-1_5 text-brown-700 ring-brown-100-dark w-full text-base ring-8">
        {{ description }}
      </div>
      <div class="flex w-full flex-col gap-2">
        <div class="flex flex-col">
          <p class="text-brown-700 text-xl">{{ display_name }}</p>
          <div class="bg-brown-300 h-0.25 w-full"></div>
          <p class="text-brown-100-dark text-sm">MEMBER</p>
        </div>
        <div class="flex flex-col">
          <p class="text-brown-700 text-xl">Debut Deck Collector</p>
          <div class="bg-brown-300 h-0.25 w-full"></div>
          <p class="text-brown-100-dark text-sm">TITLE</p>
        </div>
      </div>

      <div member-card__registration
        class="align-center text-brown-700 flex w-full justify-between text-sm font-semibold">
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

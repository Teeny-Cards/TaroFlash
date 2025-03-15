<template>
  <div
    member-card
    class="aspect-[1.59/1] flex flex-col bg-yellow-light rounded-6 shadow-modal overflow-hidden ring-yellow-light ring-8"
  >
    <div
      member-card__header
      class="flex gap-8 items-center justify-center bg-(image:--bank-note-yellow-bg) px-9.5 py-5.5"
    >
      <div class="w-30 h-0.5 bg-grey rounded-full"></div>
      <h1 class="text-2xl font-semibold text-grey">Member Card</h1>
      <div class="w-30 h-0.5 bg-grey rounded-full"></div>
    </div>
    <div
      member-card__body
      class="bg-(image:--jupiter-green-bg) bg-[#E4F0DC] flex gap-10.5 py-8.5 px-9.5 items-center h-full"
    >
      <div member-card__avatar class="h-full flex flex-col justify-center">
        <div class="w-55 h-55 bg-[#EBF1D8] rounded-22 border-[#FCFAE4] border-10"></div>
      </div>
      <div member-card__member-info class="min-w-[360px] w-full flex flex-col gap-8">
        <div class="w-full bg-yellow-light px-3.75 py-2.5 rounded-4 text-grey text-base">
          {{ description }}
        </div>
        <div class="flex flex-col gap-4 text-grey-dark">
          <p class="text-2xl font-semibold">{{ display_name }}</p>
          <div class="w-full h-0.5 bg-yellow-light"></div>
          <p class="text-lg font-semibold">Daily Dabbler</p>
          <div class="w-full h-0.5 bg-yellow-light"></div>
          <div class="flex gap-4">
            <p class="text-base font-semibold">{{ num_decks }} Deck</p>
            <div class="flex gap-0.5 items-center">
              <TeenyIcon src="paperclip" class="text-blue" />
              <p class="text-base font-semibold">4,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      member-card__footer
      class="flex justify-between align-center w-full gap-20 text-brown-light font-semibold text-base bg-(image:--bank-note-yellow-bg) px-9.5 py-5.5"
    >
      <p>Reg. {{ created_on }}</p>
      <p>&lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt;</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMemberStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import TeenyIcon from './TeenyComponents/TeenyIcon.vue'

const memberStore = useMemberStore()
const { display_name, created_at, num_decks, description } = storeToRefs(memberStore)

const created_on = computed(() => {
  var date = new Date(created_at.value)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})
</script>

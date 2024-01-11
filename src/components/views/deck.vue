<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <TeenyCard></TeenyCard>
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold text-gray-400">{{ title }}</h1>
        <h2 class="text-gray-400">{{ description }}</h2>
      </div>
      <div class="flex gap-2">
        <TeenyButton class="w-full" variant="secondary" @onClick="$emit('study')"
          >STUDY</TeenyButton
        >
        <TeenyDropdown triggerColor="gray" triggerVariant="secondary">
          <template #trigger>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                fill="currentColor"
              />
            </svg>
          </template>
          <template #dropdown>
            <div class="flex flex-col w-32">
              <TeenyButton variant="ghost" @onClick="$emit('edit')">Edit</TeenyButton>
              <TeenyButton variant="ghost" color="danger">Delete</TeenyButton>
            </div>
          </template>
        </TeenyDropdown>
      </div>
    </section>
    <section
      class="bg-white grid grid-cols-deck-desktop gap-8 rounded-2xl w-full shadow-md p-20 relative"
    >
      <TeenyCard v-for="(card, index) in cards" :key="index" size="small">
        <p class="text-xl font-semibold text-gray-500">{{ card.frontText }}</p>
      </TeenyCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  title: String,
  description: String,
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})
</script>

<template>
  <div
    data-testid="study-modal__buttons"
    class="flex flex-col justify-center gap-2 justify-self-center text-xl"
  >
    <template v-if="cardRevealed">
      <button
        class="bg-purple-dark cursor-pointer rounded-full px-13 py-4 text-white"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="$emit('correct')"
      >
        Got It!
      </button>
      <button
        class="text-brown-dark cursor-pointer rounded-full bg-white px-13 py-4"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="$emit('incorrect')"
      >
        Nope!
      </button>
    </template>
    <template v-else>
      <button
        class="bg-purple-dark cursor-pointer rounded-full px-13 py-4 text-white"
        @click="$emit('reveal')"
      >
        Show!
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { StudySession } from './index.vue'

const studySession = inject<StudySession>('studySession')

const cardRevealed = computed(() => {
  return studySession?.cardRevealed || studySession?.studiedCardIds.has(studySession?.activeCard?.id!)
})

const disabled = computed(() => {
  return studySession?.studiedCardIds.has(studySession?.activeCard?.id!)
})

defineEmits<{
  (e: 'reveal'): void
  (e: 'correct'): void
  (e: 'incorrect'): void
}>()
</script>

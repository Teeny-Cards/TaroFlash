<template>
  <div
    data-testid="study-modal__buttons"
    class="flex flex-col justify-center gap-2 justify-self-center text-xl"
  >
    <template v-if="revealed">
      <button
        class="bg-purple-dark cursor-pointer rounded-full px-13 py-4 text-white"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="$emit('correct')"
      >
        Got It!
        <ui-kit:tooltip :text="formatInterval(3)" position="top-right" />
      </button>
      <button
        class="text-brown-dark cursor-pointer rounded-full bg-white px-13 py-4"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="$emit('incorrect')"
      >
        Nope!
        <ui-kit:tooltip :text="formatInterval(1)" position="bottom-right" />
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
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { type Grade, type RecordLog } from 'ts-fsrs'

const { activeCard, activeCardOptions, cardRevealed, studiedCardIds, failedCardIds } = defineProps<{
  activeCard: Card | undefined
  activeCardOptions: RecordLog | undefined
  cardRevealed: boolean
  studiedCardIds: Set<string>
  failedCardIds: Set<string>
}>()

const revealed = computed(() => {
  return cardRevealed || studiedCardIds.has(activeCard?.id!) || failedCardIds.has(activeCard?.id!)
})

const disabled = computed(() => {
  return studiedCardIds.has(activeCard?.id!)
})

function formatInterval(grade: Grade) {
  const date = activeCardOptions?.[grade].card.due

  if (!date) return ''
  return DateTime.fromJSDate(date).toRelative({ padding: 1000 })
}

defineEmits<{
  (e: 'reveal'): void
  (e: 'correct'): void
  (e: 'incorrect'): void
}>()
</script>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'

const { options, showOptions, disabled } = defineProps<{
  options: RecordLog | undefined
  showOptions: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'revealed'): void
  (e: 'reviewed', item: RecordLogItem): void
}>()

function getRatingTimeFormat(grade: Grade) {
  const date = options?.[grade].card.due

  if (!date) return ''
  return DateTime.fromJSDate(date).toRelative({ padding: 1000 })
}

function onRatingClicked(grade: Grade) {
  const item = options?.[grade]

  if (item) {
    emit('reviewed', item)
  }
}
</script>

<template>
  <div
    data-testid="study-modal__buttons"
    class="flex flex-col justify-center gap-2 justify-self-center text-xl"
  >
    <template v-if="showOptions">
      <button
        class="bg-purple-dark cursor-pointer rounded-full px-13 py-4 text-white"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Good)"
      >
        Got It!
        <ui-kit:tooltip :text="getRatingTimeFormat(Rating.Good)" position="top-right" />
      </button>
      <button
        class="text-brown-dark cursor-pointer rounded-full bg-white px-13 py-4"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Again)"
      >
        Nope!
        <ui-kit:tooltip :text="getRatingTimeFormat(Rating.Again)" position="bottom-right" />
      </button>
    </template>
    <template v-else>
      <button
        class="bg-purple-dark cursor-pointer rounded-full px-13 py-4 text-white"
        @click="$emit('revealed')"
      >
        Show!
      </button>
    </template>
  </div>
</template>

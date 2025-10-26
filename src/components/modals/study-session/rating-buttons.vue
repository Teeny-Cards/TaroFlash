<script setup lang="ts">
import { DateTime } from 'luxon'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { useI18n } from 'vue-i18n'
import UiTooltip from '@/components/ui-kit/tooltip.vue'

const { t } = useI18n()

const {
  options,
  showOptions,
  disabled = false
} = defineProps<{
  options?: RecordLog
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

  const time = DateTime.fromJSDate(date)
  const timeString = time.toRelativeCalendar()

  return t('study.study-again', { time: timeString })
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
    data-testid="rating-buttons"
    class="flex flex-col justify-center gap-2 justify-self-center text-2xl"
  >
    <template v-if="showOptions">
      <button
        data-testid="rating-buttons__good"
        class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Good)"
      >
        {{ t('study.got-it!') }}
        <ui-tooltip :text="getRatingTimeFormat(Rating.Good)" />
      </button>
      <button
        data-testid="rating-buttons__again"
        class="text-brown-700 cursor-pointer rounded-full bg-white px-13 py-4"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Again)"
      >
        {{ t('study.nope!') }}
        <ui-tooltip :text="getRatingTimeFormat(Rating.Again)" placement="bottom" />
      </button>
    </template>
    <template v-else>
      <button
        data-testid="rating-buttons__show"
        class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white"
        @click="$emit('revealed')"
      >
        {{ t('study.show!') }}
      </button>
    </template>
  </div>
</template>

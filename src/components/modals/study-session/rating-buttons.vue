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
  <div data-testid="rating-buttons" class="flex justify-center gap-2 text-2xl">
    <template v-if="showOptions">
      <ui-tooltip
        :text="getRatingTimeFormat(Rating.Again)"
        element="button"
        :gap="-12"
        data-testid="rating-buttons__again"
        class="text-brown-700 cursor-pointer rounded-full bg-white px-13 py-4 hover:-translate-0.5
          hover:shadow-sm transition-all duration-50"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Again)"
      >
        {{ t('study.nope') }}
      </ui-tooltip>

      <ui-tooltip
        :text="getRatingTimeFormat(Rating.Good)"
        element="button"
        :gap="-12"
        data-testid="rating-buttons__good"
        class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white hover:-translate-0.5
          hover:shadow-sm transition-all duration-50"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        @click="onRatingClicked(Rating.Good)"
      >
        {{ t('study.got-it') }}
      </ui-tooltip>
    </template>

    <button
      v-else
      data-testid="rating-buttons__show"
      class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white hover:-translate-0.5
        hover:shadow-sm transition-all duration-50"
      @click="$emit('revealed')"
    >
      {{ t('study.flip') }}
    </button>
  </div>
</template>

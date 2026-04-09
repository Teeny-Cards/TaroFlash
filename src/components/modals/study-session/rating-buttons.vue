<script setup lang="ts">
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { useI18n } from 'vue-i18n'
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import { useRatingFormat } from '@/utils/fsrs'
import { emitSfx } from '@/sfx/bus'

const { t } = useI18n()
const { getRatingTimeFormat } = useRatingFormat()

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

function onRatingClicked(grade: Grade) {
  const item = options?.[grade]

  if (item) {
    emitSfx(grade === Rating.Good ? 'ui.music_plink_ok' : 'ui.music_plink_locancel')
    emit('reviewed', item)
  }
}
</script>

<template>
  <div data-testid="rating-buttons" class="flex justify-center gap-2 text-2xl">
    <template v-if="showOptions">
      <ui-tooltip
        :text="getRatingTimeFormat(Rating.Again, options, 'short')"
        element="button"
        :gap="-12"
        data-testid="rating-buttons__again"
        class="text-brown-700 cursor-pointer rounded-full bg-white px-13 py-4 hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        static_on_mobile
        @click="onRatingClicked(Rating.Again)"
      >
        {{ t('study.nope') }}
      </ui-tooltip>

      <ui-tooltip
        :text="getRatingTimeFormat(Rating.Good, options, 'short')"
        element="button"
        :gap="-12"
        data-testid="rating-buttons__good"
        class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
        :class="{ 'opacity-50': disabled }"
        :disabled="disabled"
        static_on_mobile
        @click="onRatingClicked(Rating.Good)"
      >
        {{ t('study.got-it') }}
      </ui-tooltip>
    </template>

    <button
      v-else
      data-testid="rating-buttons__show"
      class="cursor-pointer rounded-full bg-purple-500 px-13 py-4 text-white hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
      @click="$emit('revealed')"
    >
      {{ t('study.flip') }}
    </button>
  </div>
</template>

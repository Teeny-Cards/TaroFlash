<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiSpinbox from '@/components/ui-kit/spinbox.vue'

type TabStudyProps = {
  card_count?: number
}

const { card_count } = defineProps<TabStudyProps>()

const { t } = useI18n()

const shuffle = defineModel<boolean | undefined>('shuffle')
const flip_cards = defineModel<boolean | undefined>('flip_cards')
const is_spaced = defineModel<boolean | undefined>('is_spaced')
const auto_play = defineModel<boolean | undefined>('auto_play')
const max_reviews_per_day = defineModel<number | null | undefined>('max_reviews_per_day')
const max_new_per_day = defineModel<number | null | undefined>('max_new_per_day')

const STEP = 5
const MIN = 5
const REVIEWS_MAX = 200
const NEW_MAX = 100
const REVIEWS_DEFAULT = 50
const NEW_DEFAULT = 20

const is_reviews_all = ref(max_reviews_per_day.value === null)
const reviews_local = ref(max_reviews_per_day.value ?? REVIEWS_DEFAULT)

const is_new_all = ref(max_new_per_day.value === null)
const new_local = ref(max_new_per_day.value ?? NEW_DEFAULT)

watch(max_reviews_per_day, (v) => {
  is_reviews_all.value = v === null
  if (v != null) reviews_local.value = v
})

watch(max_new_per_day, (v) => {
  is_new_all.value = v === null
  if (v != null) new_local.value = v
})

function onReviewsChange(n: number) {
  reviews_local.value = n
  const all = n >= REVIEWS_MAX
  is_reviews_all.value = all
  max_reviews_per_day.value = all ? null : n
}

function onNewChange(n: number) {
  new_local.value = n
  const all = n >= NEW_MAX
  is_new_all.value = all
  max_new_per_day.value = all ? null : n
}

const reviews_all = computed({
  get: () => is_reviews_all.value,
  set: (on: boolean) => {
    if (on && card_count != null) reviews_local.value = card_count
    is_reviews_all.value = on
    max_reviews_per_day.value = on ? null : reviews_local.value
  }
})

const new_all = computed({
  get: () => is_new_all.value,
  set: (on: boolean) => {
    if (on && card_count != null) new_local.value = card_count
    is_new_all.value = on
    max_new_per_day.value = on ? null : new_local.value
  }
})
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <ui-toggle v-model:checked="is_spaced">
      <div class="flex items-center gap-2.5">
        <ui-icon src="moon-stars" />
        {{ t('deck.settings-modal.study.is-spaced') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="shuffle">
      <div class="flex items-center gap-2.5">
        <ui-icon src="reorder" />
        {{ t('deck.settings-modal.study.shuffle') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="flip_cards">
      <div class="flex items-center gap-2.5">
        <ui-icon src="horizontal-align" />
        {{ t('deck.settings-modal.study.flip-cards') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="auto_play">
      <div class="flex items-center gap-2.5">
        <ui-icon src="bell" />
        {{ t('deck.settings-modal.study.auto-play') }}
      </div>
    </ui-toggle>

    <div data-testid="tab-study__max-reviews" class="flex flex-col gap-2">
      <span class="text-sm font-medium text-brown-700">
        {{ t('deck.settings-modal.study.max-reviews-per-day') }}
      </span>
      <div data-testid="tab-study__max-reviews-row" class="flex items-center gap-4">
        <ui-spinbox
          :value="reviews_local"
          :min="MIN"
          :max="REVIEWS_MAX"
          :step="STEP"
          wrap
          @update:value="onReviewsChange"
        />
        <ui-toggle data-testid="tab-study__max-reviews-all" v-model:checked="reviews_all">
          {{ t('study.settings.max-reviews.all-toggle') }}
        </ui-toggle>
      </div>
    </div>

    <div data-testid="tab-study__max-new" class="flex flex-col gap-2">
      <span class="text-sm font-medium text-brown-700">
        {{ t('deck.settings-modal.study.max-new-per-day') }}
      </span>
      <div data-testid="tab-study__max-new-row" class="flex items-center gap-4">
        <ui-spinbox
          :value="new_local"
          :min="MIN"
          :max="NEW_MAX"
          :step="STEP"
          wrap
          @update:value="onNewChange"
        />
        <ui-toggle data-testid="tab-study__max-new-all" v-model:checked="new_all">
          {{ t('study.settings.max-new.all-toggle') }}
        </ui-toggle>
      </div>
    </div>
  </div>
</template>

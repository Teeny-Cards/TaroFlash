<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import CappedSpinboxRow from './capped-spinbox-row.vue'

type TabStudyProps = {
  card_count?: number
}

const { card_count } = defineProps<TabStudyProps>()

const config = defineModel<DeckConfig>('config', { required: true })

const { t } = useI18n()

const STEP = 5
const MIN = 5
const REVIEWS_MAX = 200
const NEW_MAX = 100
const REVIEWS_DEFAULT = 50
const NEW_DEFAULT = 20

function field<K extends keyof DeckConfig>(key: K) {
  return computed({
    get: () => config.value[key],
    set: (v: DeckConfig[K]) => (config.value = { ...config.value, [key]: v })
  })
}

const shuffle = field('shuffle')
const flip_cards = field('flip_cards')
const is_spaced = field('is_spaced')
const auto_play = field('auto_play')
const max_reviews_per_day = field('max_reviews_per_day')
const max_new_per_day = field('max_new_per_day')
</script>

<template>
  <div data-testid="tab-study" class="flex w-full flex-col gap-5">
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

    <capped-spinbox-row
      data-testid="tab-study__max-reviews"
      :label="t('deck.settings-modal.study.max-reviews-per-day')"
      :all_label="t('deck.settings-modal.study.max-reviews.all-toggle')"
      :min="MIN"
      :max="REVIEWS_MAX"
      :step="STEP"
      :default_value="REVIEWS_DEFAULT"
      :prefill_when_all="card_count"
      v-model:value="max_reviews_per_day"
    />

    <capped-spinbox-row
      data-testid="tab-study__max-new"
      :label="t('deck.settings-modal.study.max-new-per-day')"
      :all_label="t('deck.settings-modal.study.max-new.all-toggle')"
      :min="MIN"
      :max="NEW_MAX"
      :step="STEP"
      :default_value="NEW_DEFAULT"
      :prefill_when_all="card_count"
      v-model:value="max_new_per_day"
    />
  </div>
</template>

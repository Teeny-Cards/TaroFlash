<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import CappedSpinboxRow from './capped-spinbox-row.vue'

type TabStudyProps = {
  card_count?: number
  config: DeckConfig
}

const { card_count, config } = defineProps<TabStudyProps>()

const { t } = useI18n()

const STEP = 5
const MIN = 5
const REVIEWS_MAX = 200
const NEW_MAX = 100
const REVIEWS_DEFAULT = 50
const NEW_DEFAULT = 20

function field<K extends keyof DeckConfig>(key: K) {
  return computed({
    get: () => config[key],
    set: (v: DeckConfig[K]) => (config[key] = v)
  })
}

const shuffle = field('shuffle')
const flip_cards = field('flip_cards')
const max_reviews_per_day = field('max_reviews_per_day')
const max_new_per_day = field('max_new_per_day')
</script>

<template>
  <section-list data-testid="tab-study">
    <labeled-section :label="t('deck.settings-modal.study.section.cards-heading')">
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
    </labeled-section>

    <labeled-section
      :label="t('deck.settings-modal.study.section.limits-heading')"
      :description="t('deck.settings-modal.study.section.limits-description')"
    >
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
    </labeled-section>
  </section-list>
</template>

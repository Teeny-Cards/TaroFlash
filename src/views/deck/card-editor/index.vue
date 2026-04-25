<script lang="ts" setup>
import List from './list.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { inject } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const { t } = useI18n()
const { all_cards, addCard } = inject<CardListController>('card-editor')!
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!all_cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button data-theme="blue-500" icon-left="add" @click="addCard()">
      {{ t('deck-view.add-card') }}
    </ui-button>
  </div>

  <list />
</template>

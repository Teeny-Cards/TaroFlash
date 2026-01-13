<script lang="ts" setup>
import List from './list-desktop/list.vue'
import ListMobile from './list-mobile/list.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { inject, computed } from 'vue'
import { useMediaQuery } from '@/composables/use-media-query'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'

const { t } = useI18n()
const is_desktop = useMediaQuery('md')
const { all_cards, addCard } = inject<CardBulkEditor>('card-editor')!

const list_component = computed(() => {
  return is_desktop.value ? List : ListMobile
})
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!all_cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button icon-left="add" @click="addCard()">
      {{ t('deck-view.add-card') }}
    </ui-button>
  </div>

  <component :is="list_component" />
</template>

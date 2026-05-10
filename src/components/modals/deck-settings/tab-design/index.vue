<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoverDesigner from './cover-designer/index.vue'
import CardDesigner from './card-designer.vue'
import TabBar from '../tab-bar.vue'

type TabDesignProps = {
  cover: DeckCover
  card_attributes: DeckCardAttributes
  side: CardSide
}

type SideTab = { value: CardSide; label: string }

const { card_attributes, side } = defineProps<TabDesignProps>()

const emit = defineEmits<{
  (e: 'update:side', value: CardSide): void
}>()

const { t } = useI18n()

const tabs = computed<SideTab[]>(() => [
  { value: 'cover', label: t('deck.settings-modal.designer-tabs.cover') },
  { value: 'front', label: t('deck.settings-modal.designer-tabs.front') },
  { value: 'back', label: t('deck.settings-modal.designer-tabs.back') }
])

const card_side_attributes = computed(() =>
  side === 'front' ? card_attributes.front : card_attributes.back
)
</script>

<template>
  <div data-testid="tab-design" class="flex flex-col items-center gap-6">
    <tab-bar :tabs="tabs" :active="side" @update:active="emit('update:side', $event)" />
    <cover-designer v-if="side === 'cover'" :config="cover" />
    <card-designer v-else :attributes="card_side_attributes" />
  </div>
</template>

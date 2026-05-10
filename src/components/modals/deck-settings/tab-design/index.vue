<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import CoverDesigner from './cover-designer/index.vue'
import CardDesigner from './card-designer/index.vue'
import TabBar from './tab-bar.vue'
import { deckEditorKey } from '@/composables/deck-editor'

type SideTab = { value: CardSide; label: string }

const { t } = useI18n()
const editor = inject(deckEditorKey)!

const tabs = computed<SideTab[]>(() => [
  { value: 'cover', label: t('deck.settings-modal.designer-tabs.cover') },
  { value: 'front', label: t('deck.settings-modal.designer-tabs.front') },
  { value: 'back', label: t('deck.settings-modal.designer-tabs.back') }
])

const card_side_attributes = computed(() =>
  editor.active_side.value === 'front' ? editor.card_attributes.front : editor.card_attributes.back
)
</script>

<template>
  <div data-testid="tab-design" class="flex flex-col items-center gap-6">
    <tab-bar
      :tabs="tabs"
      :active="editor.active_side.value"
      @update:active="editor.setActiveSide"
    />
    <cover-designer v-if="editor.active_side.value === 'cover'" :config="editor.cover" />
    <card-designer v-else :attributes="card_side_attributes" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CoverDesignerToolbar from './cover-designer/index.vue'
import CardDesignerToolbar from './card-designer-toolbar.vue'
import TabBar from './tab-bar.vue'
import Card from '@/components/card/index.vue'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'
import { emitSfx } from '@/sfx/bus'

type DesignerSide = 'cover' | 'front' | 'back'

type TabDesignProps = {
  deck_id?: number
  cover: DeckCover
  card_attributes: DeckCardAttributes
}

const { deck_id, cover, card_attributes } = defineProps<TabDesignProps>()

const { t } = useI18n()

const cards_query = useCardsInDeckInfiniteQuery(() => deck_id)
const first_card = computed(() => cards_query.data.value?.pages?.[0]?.[0])

const active_side = ref<DesignerSide>('cover')

const sides = computed(() => [
  { value: 'cover' as const, label: t('deck.settings-modal.designer-tabs.cover') },
  { value: 'front' as const, label: t('deck.settings-modal.designer-tabs.front') },
  { value: 'back' as const, label: t('deck.settings-modal.designer-tabs.back') }
])

const preview_text = computed(() => {
  if (active_side.value === 'front') {
    return first_card.value?.front_text || t('deck.settings-modal.preview.front-fallback')
  }
  return first_card.value?.back_text || t('deck.settings-modal.preview.back-fallback')
})

function onSideChange(side: DesignerSide) {
  if (side === active_side.value) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.slide_up')
  active_side.value = side
}

function cycleSide() {
  const index = sides.value.findIndex((side) => side.value === active_side.value)
  const next = (index + 1) % sides.value.length
  onSideChange(sides.value[next].value)
}
</script>

<template>
  <div data-testid="tab-design" class="flex flex-col items-center gap-3">
    <tab-bar :tabs="sides" :active="active_side" @update:active="onSideChange" />

    <div data-testid="tab-design__preview" class="relative flex w-min flex-col items-center">
      <card
        size="xl"
        :side="active_side"
        :front_text="active_side === 'front' ? preview_text : undefined"
        :back_text="active_side === 'back' ? preview_text : undefined"
        :cover_config="cover"
        :card_attributes="card_attributes"
        class="cursor-pointer"
        @click="cycleSide"
      />
    </div>

    <div data-testid="tab-design__toolbar">
      <cover-designer-toolbar v-if="active_side === 'cover'" :config="cover" />
      <card-designer-toolbar
        v-else-if="active_side === 'front'"
        :attributes="card_attributes.front"
      />
      <card-designer-toolbar v-else :attributes="card_attributes.back" />
    </div>
  </div>
</template>

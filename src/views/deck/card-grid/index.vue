<script setup lang="ts">
import GridItem from './grid-item.vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'
import { inject, ref, useTemplateRef, watch } from 'vue'
import { useGridCapacity } from '@/composables/use-grid-capacity'
import { useMediaQuery } from '@/composables/use-media-query'
import { slideInFromDirection, slideOutInDirection } from '@/utils/animations/grid-page'

const {
  is_selecting,
  isCardSelected,
  card_attributes,
  visible_cards,
  setVisibleCapacity,
  page,
  page_direction
} = inject<CardListController>('card-editor')!

const side = ref<'front' | 'back'>('front')
const grid = useTemplateRef<HTMLElement>('grid')
const grid_wrapper = useTemplateRef<HTMLElement>('grid_wrapper')

const isSm = useMediaQuery('sm')
const isMd = useMediaQuery('md')

const { gridStyle, capacity } = useGridCapacity({
  grid,
  bounds: grid_wrapper,
  trackMin: () => (isSm.value ? 192 : 176),
  gap: () => (isMd.value ? 16 : 8)
})

watch(capacity, (n) => setVisibleCapacity(n), { immediate: true })

const emit = defineEmits<{
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
}>()
</script>

<template>
  <div
    data-testid="card-grid-container"
    class="flex flex-col items-center w-full max-w-208 xl:max-w-full flex-1 min-h-0 overflow-hidden"
  >
    <div
      ref="grid_wrapper"
      data-testid="card-grid__wrapper"
      class="w-full flex-1 min-h-0 overflow-hidden"
    >
      <Transition
        :css="false"
        mode="out-in"
        @enter="(el, done) => slideInFromDirection(el, page_direction, done)"
        @leave="(el, done) => slideOutInDirection(el, page_direction, done)"
      >
        <div
          :key="page"
          ref="grid"
          data-testid="card-grid"
          :style="gridStyle"
          class="justify-items-center py-3 w-full"
        >
          <grid-item
            v-for="card in visible_cards"
            :key="card.client_id"
            :card="card"
            :is_selecting="is_selecting"
            :side="side"
            :card_attributes="card_attributes"
            :selected="card.id !== undefined ? isCardSelected(card.id) : false"
            @card-selected="emit('card-selected', card.id!)"
          ></grid-item>
        </div>
      </Transition>
    </div>
  </div>
</template>

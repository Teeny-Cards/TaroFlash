<script lang="ts" setup>
import ItemOptions from './list-item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { inject, computed, useTemplateRef } from 'vue'
import ListItemCard from './list-item-card.vue'

const { card, index } = defineProps<{
  index: number
  card: Card
  duplicate: boolean
}>()

const { mode, selected_card_ids, appendCard, prependCard } = inject<CardBulkEditor>('card-editor')!

const onDeleteCard = inject<(id: number) => void>('on-delete-card')
const onMoveCard = inject<(id: number) => void>('on-move-card')
const onSelectCard = inject<(id: number) => void>('on-select-card')

const list_item_card = useTemplateRef('list-item-card')

const selected = computed(() => selected_card_ids.value.includes(card.id!))

function onClick(e: MouseEvent) {
  if (!(e.target as HTMLElement)?.closest('[contenteditable]')) {
    e.preventDefault()
  }

  if (list_item_card.value?.hasFocusWithin()) return

  list_item_card.value?.focusEditor()
}
</script>

<template>
  <div
    data-testid="card-list-item"
    :data-id="card.id"
    class="group/listitem relative grid w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto]
      gap-x-6 focus-within:gap-y-6 place-items-center rounded-6 bg-transparent p-0 sm:p-6
      transition-colors duration-100 ease-in-out focus-within:bg-brown-300
      hover:focus-within:bg-brown-300 hover:not-focus-within:bg-brown-200
      dark:focus-within:bg-blue-650 dark:hover:focus-within:bg-blue-650
      dark:hover:not-focus-within:bg-grey-700"
    :class="{ 'cursor-pointer': mode === 'select' }"
    @mousedown="onClick"
  >
    <button
      data-testid="card-list-item__reorder"
      class="hidden h-12 w-12 cursor-grab items-center justify-center rounded-full bg-brown-300
        text-lg text-brown-700 sm:flex group-focus-within/listitem:bg-brown-100 row-span-2"
      @click.stop
    >
      <ui-icon
        src="reorder"
        class="hidden group-hover/listitem:block group-focus-within/listitem:block"
      />
      <span class="group-focus-within/listitem:hidden group-hover/listitem:hidden">
        {{ index + 1 }}
      </span>
    </button>

    <list-item-card ref="list-item-card" :card="card" :duplicate="duplicate" />

    <item-options
      v-if="mode !== 'select'"
      class="hidden sm:grid opacity-0 pointer-events-none transition-opacity duration-100
        ease-in-out group-hover/listitem:opacity-100 group-hover/listitem:pointer-events-auto
        group-focus-within/listitem:opacity-100 group-focus-within/listitem:pointer-events-auto
        row-span-2"
      @select="onSelectCard?.(card.id!)"
      @move="onMoveCard?.(card.id!)"
      @delete="onDeleteCard?.(card.id!)"
    />
    <ui-radio v-else :checked="selected" />

    <div
      class="grid-rows-2 h-0 group-focus-within/listitem:flex group-focus-within/listitem:h-10
        overflow-hidden transition-all duration-75"
    >
      <slot name="toolbar"></slot>
    </div>

    <ui-button
      data-testid="card-list-item__add-above"
      icon-left="add"
      icon-only
      theme="brown-100"
      size="xs"
      class="absolute! z-1 top-0 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity
        duration-100 ease-in-out group-hover/listitem:opacity-100
        group-hover/listitem:pointer-events-auto group-focus-within/listitem:opacity-100
        group-focus-within/listitem:pointer-events-auto *:[.btn-icon]:text-brown-500"
      @click.stop="prependCard(card.id!)"
    />
    <ui-button
      data-testid="card-list-item__add-below"
      icon-left="add"
      icon-only
      theme="brown-100"
      size="xs"
      class="absolute! z-1 bottom-0 translate-y-1/2 opacity-0 pointer-events-none transition-opacity
        duration-100 ease-in-out group-hover/listitem:opacity-100
        group-hover/listitem:pointer-events-auto group-focus-within/listitem:opacity-100
        group-focus-within/listitem:pointer-events-auto *:[.btn-icon]:text-brown-500"
      @click.stop="appendCard(card.id!)"
    />
  </div>
</template>

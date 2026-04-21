<script lang="ts" setup>
import ItemOptions from './list-item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { type CardListController } from '@/composables/card-list-controller'
import { inject, computed, useTemplateRef } from 'vue'
import ListItemCard from './list-item-card.vue'

const { card, index } = defineProps<{
  index: number
  card: Card
  duplicate: boolean
}>()

const { mode, isCardSelected, appendCard, prependCard, onDeleteCards, onMoveCards, onSelectCard } =
  inject<CardListController>('card-editor')!

const list_item_card = useTemplateRef('list-item-card')

const selected = computed(() => isCardSelected(card.id!))

function onClick(e: MouseEvent) {
  const closest = (selector: string) => !!(e.target as HTMLElement)?.closest(selector)

  // If we're in select mode, select the card and blur the active element
  if (mode.value === 'select') {
    onSelectCard(card.id!)
    ;(document.activeElement as HTMLElement)?.blur?.()
    return
  }

  // If the click is on a button, let the button handle it
  // Prevent default to avoid stealing focus state
  if (closest('button')) {
    e.preventDefault()
    return
  }

  // If the click IS NOT on an input, prevent default to avoid stealing focus state
  // If the click IS on an input, we expect it to steal focus and don't want to prevent that here
  if (!closest('[contenteditable]')) e.preventDefault()

  // focus the card's front-text editor if the card doesn't already have focus
  if (!list_item_card.value?.hasFocusWithin()) list_item_card.value?.focusEditor()
}
</script>

<template>
  <div
    data-testid="card-list-item"
    :data-id="card.id"
    class="group/listitem relative grid w-full grid-cols-[1fr_auto_1fr] gap-x-6 place-items-center rounded-6 bg-transparent p-0 sm:p-6 transition-colors duration-100 ease-in-out hover:not-focus-within:bg-brown-200 dark:hover:not-focus-within:bg-grey-700 [content-visibility:auto] [contain-intrinsic-size:auto_407px]"
    :class="{
      'cursor-pointer': mode === 'select',
      'focus-within:bg-brown-300 hover:focus-within:bg-brown-300 dark:focus-within:bg-blue-650 dark:hover:focus-within:bg-blue-650':
        mode !== 'select'
    }"
    @mousedown="onClick"
  >
    <button
      data-testid="card-list-item__reorder"
      class="hidden h-12 w-12 cursor-grab items-center justify-center rounded-full bg-brown-300 text-lg text-brown-700 sm:flex group-focus-within/listitem:bg-brown-100 row-span-2"
      @click.stop
    >
      <ui-icon
        src="reorder"
        class="hidden"
        :class="{
          'group-hover/listitem:block group-focus-within/listitem:block': mode !== 'select'
        }"
      />
      <span
        :class="{
          'group-focus-within/listitem:hidden group-hover/listitem:hidden': mode !== 'select'
        }"
      >
        {{ index + 1 }}
      </span>
    </button>

    <list-item-card ref="list-item-card" :card="card" :duplicate="duplicate" />

    <item-options
      v-if="mode !== 'select'"
      class="hidden sm:grid opacity-0 pointer-events-none transition-opacity duration-100 ease-in-out group-hover/listitem:opacity-100 group-hover/listitem:pointer-events-auto group-focus-within/listitem:opacity-100 group-focus-within/listitem:pointer-events-auto row-span-2"
      @select="onSelectCard(card.id!)"
      @move="onMoveCards(card.id!)"
      @delete="onDeleteCards(card.id!)"
    />
    <ui-radio v-else :checked="selected" />

    <ui-button
      v-if="mode !== 'select'"
      data-testid="card-list-item__add-above"
      icon-left="add"
      icon-only
      theme="brown-100"
      size="xs"
      class="absolute! z-1 top-0 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-100 ease-in-out group-hover/listitem:opacity-100 group-hover/listitem:pointer-events-auto group-focus-within/listitem:opacity-100 group-focus-within/listitem:pointer-events-auto *:[.btn-icon]:text-brown-500"
      @click.stop="prependCard(card.id!)"
    />
    <ui-button
      v-if="mode !== 'select'"
      data-testid="card-list-item__add-below"
      icon-left="add"
      icon-only
      theme="brown-100"
      size="xs"
      class="absolute! z-1 bottom-0 translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-100 ease-in-out group-hover/listitem:opacity-100 group-hover/listitem:pointer-events-auto group-focus-within/listitem:opacity-100 group-focus-within/listitem:pointer-events-auto *:[.btn-icon]:text-brown-500"
      @click.stop="appendCard(card.id!)"
    />
  </div>
</template>

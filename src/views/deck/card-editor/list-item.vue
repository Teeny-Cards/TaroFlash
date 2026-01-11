<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import ItemOptions from './item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { useToast } from '@/composables/toast'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'
import { inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageButton from '../image-button.vue'
import { setCardImage, deleteCardImage } from '@/api/cards'

const { card, index } = defineProps<{
  index: number
  card: Card
  duplicate: boolean
}>()

const { t } = useI18n()
const toast = useToast()

const { mode, selected_card_ids, updateCard, appendCard, prependCard } =
  inject<CardBulkEditor>('card-editor')!
const onDeleteCard = inject<(id: number) => void>('on-delete-card')
const onMoveCard = inject<(id: number) => void>('on-move-card')
const onSelectCard = inject<(id: number) => void>('on-select-card')

const selected = computed(() => selected_card_ids.value.includes(card.id!))

function onUpdate(id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload) {
  const { text, delta, attributes } = payload
  const update: Partial<Card> = {
    [`${side}_delta`]: delta,
    [`${side}_text`]: text,
    attributes
  }

  updateCard(id, update)
}

async function onImageUpload(side: 'front' | 'back', file: File) {
  if (!card.id) return

  try {
    await setCardImage(card.id, file, side)
  } catch (e: any) {
    toast.error(t('card.image-upload-error'))
  }
}

async function onImageDelete(side: 'front' | 'back') {
  if (!card.id) return

  try {
    await deleteCardImage(card.id, side)
    onUpdate(card.id, side, {
      [`${side}_image`]: undefined
    })
  } catch (e: any) {
    toast.error(t('card.image-delete-error'))
  }
}
</script>

<template>
  <div
    data-testid="card-list-item"
    :data-id="card.id"
    :hover_effect="mode === 'select'"
    v-sfx.hover="'ui.click_07'"
    class="card-list-item group/listitem p-0 sm:p-6"
    :class="{
      'mode-select cursor-pointer': mode === 'select',
      'mode-view': mode === 'view',
      duplicate
    }"
  >
    <button
      class="sm:flex items-center justify-center w-12 h-12 rounded-full text-lg text-brown-800
        cursor-grab hidden bg-brown-300 group-focus-within/listitem:bg-brown-100"
      @click.stop
    >
      <ui-icon
        src="reorder"
        class="hidden group-hover/listitem:block group-focus-within/listitem:block"
      />
      <span class="group-focus-within/listitem:hidden group-hover/listitem:hidden">{{
        index + 1
      }}</span>
    </button>

    <div class="flex flex-col md:flex-row w-full gap-6 justify-center">
      <card
        data-testid="front-input"
        ref="front-input"
        :data-id="card.id"
        side="front"
        size="xl"
        mode="edit"
        v-bind="card"
        class="group/card"
        :class="{ 'pointer-events-none': mode === 'select' }"
        :placeholder="t('card.placeholder-front')"
        @update:front="onUpdate(card.id!, 'front', $event)"
      >
        <image-button
          class="absolute! -top-2 -left-2 opacity-0 group-hover/card:opacity-100"
          :image="card.front_image_path"
          @image-uploaded="onImageUpload('front', $event)"
          @image-deleted="onImageDelete('front')"
          @click.stop
        />
      </card>
      <card
        data-testid="back-input"
        ref="back-input"
        :data-id="card.id"
        side="back"
        size="xl"
        mode="edit"
        v-bind="card"
        class="group/card"
        :class="{ 'pointer-events-none': mode === 'select' }"
        :placeholder="t('card.placeholder-back')"
        @update:back="onUpdate(card.id!, 'back', $event)"
      >
        <image-button
          class="absolute! -top-2 -right-2 opacity-0 group-hover/card:opacity-100"
          :image="card.back_image_path"
          @image-uploaded="onImageUpload('back', $event)"
          @image-deleted="onImageDelete('back')"
          @click.stop
        />
      </card>
    </div>

    <item-options
      v-if="mode !== 'select'"
      class="card-list-item__options hidden sm:grid"
      @select="onSelectCard?.(card.id!)"
      @move="onMoveCard?.(card.id!)"
      @delete="onDeleteCard?.(card.id!)"
    />
    <ui-radio :checked="selected" v-else></ui-radio>

    <ui-button
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="card-list__button card-list__button--top"
      @click.stop="prependCard(card.id!)"
    />
    <ui-button
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="card-list__button card-list__button--bottom"
      @click.stop="appendCard(card.id!)"
    />
  </div>
</template>

<style>
.card-list-item {
  --card-list-item-bg: transparent;

  position: relative;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-items: center;

  width: 100%;
  border-radius: 24px;
  background-color: var(--card-list-item-bg);

  transition: background-color 0.1s ease-in-out;
}
.card-list-item:focus-within {
  --card-list-item-bg: var(--color-brown-300);
}
.card-list-item:not(:focus-within):hover {
  --card-list-item-bg: var(--color-brown-200);
}

.card-list-item__options {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s ease-in-out;
}
.card-list-item:focus-within .card-list-item__options,
.card-list-item:hover .card-list-item__options {
  opacity: 1;
  pointer-events: auto;
}

.card-list__button {
  opacity: 0;
  pointer-events: none;

  position: absolute;
  z-index: 1;
  transition: opacity 0.1s ease-in-out;
}
.card-list-item:hover .card-list__button,
.card-list-item:focus-within .card-list__button {
  display: flex;
  opacity: 1;
  pointer-events: auto;
}
.card-list__button--top {
  top: 0;
  transform: translate(0, -50%);
}
.card-list__button--bottom {
  bottom: 0;
  transform: translate(0, 50%);
}

.card-list__button .btn-icon {
  color: var(--color-brown-500) !important;
}
.card-list__button:hover {
  outline-color: var(--color-brown-300) !important;
}

@media (prefers-color-scheme: dark) {
  .card-list-item:focus-within {
    --card-list-item-bg: var(--color-blue-650);
  }
  .card-list-item:not(:focus-within):hover {
    --card-list-item-bg: var(--color-grey-700);
  }
}
</style>

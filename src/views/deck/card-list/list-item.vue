<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import ItemOptions from './item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { useToast } from '@/composables/toast'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageButton from '../image-button.vue'
import { setCardImage, deleteCardImage } from '@/api/cards'

const { card, mode, active, active_side } = defineProps<{
  index: number
  card: Card
  mode: CardEditorMode
  active: boolean
  selected: boolean
  is_duplicate?: boolean
  active_side: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
  (e: 'activated'): void
  (e: 'deactivated'): void
  (e: 'updated', id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload): void
  (e: 'side-changed', side: 'front' | 'back'): void
  (e: 'add-card', side: 'left' | 'right'): void
}>()

const { t } = useI18n()
const toast = useToast()

function onClick() {
  if (mode === 'select') {
    emit('selected')
  } else if (!active) {
    emit('activated')
  }
}

function onUpdate(id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload) {
  emit('updated', id, side, payload)
}

function activate(side: 'front' | 'back') {
  if (active_side !== side) {
    if (side === 'front') {
      emit('side-changed', 'front')
    } else if (side === 'back') {
      emit('side-changed', 'back')
    }
  }

  if (!active) {
    emit('activated')
  }
}

function deactivate(e: Event) {
  const target = e.target as HTMLElement
  const is_toolbar = target.closest('[data-testid="text-editor-toolbar"]')
  const is_card = target.closest(`[data-id="${card.id}"]`)

  if (!is_toolbar && !is_card) {
    emit('deactivated')
  }
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
    emit('updated', card.id, side, {
      [`${side}_image`]: undefined
    })
  } catch (e: any) {
    toast.error(t('card.image-delete-error'))
  }
}

watch(
  () => active,
  (new_value) => {
    if (new_value) {
      document.addEventListener('click', deactivate)
    } else {
      document.removeEventListener('click', deactivate)
    }
  }
)
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
      active: active,
      duplicate: is_duplicate
    }"
    @click="onClick"
  >
    <button
      class="sm:flex items-center justify-center w-12 h-12 rounded-full text-lg text-brown-900
        cursor-grab hidden"
      :class="{ 'bg-brown-300': !active, 'bg-brown-100': active }"
      @click.stop
    >
      <ui-icon
        src="reorder"
        :class="{
          'group-hover/listitem:block': !active && mode !== 'select',
          block: active && mode !== 'select',
          hidden: !active || mode === 'select'
        }"
      />
      <span
        :class="{
          hidden: active && mode !== 'select',
          'group-hover/listitem:hidden': !active && mode !== 'select'
        }"
        >{{ index + 1 }}</span
      >
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
        :active="active && active_side === 'front'"
        :placeholder="t('card.placeholder-front')"
        @focus="activate('front')"
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
        :active="active && active_side === 'back'"
        :placeholder="t('card.placeholder-back')"
        @focus="activate('back')"
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
      @select="emit('selected')"
      @move="emit('moved')"
      @delete="emit('deleted')"
    />
    <ui-radio :checked="selected" v-else></ui-radio>

    <ui-button
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="card-list__button card-list__button--top"
      @click.stop="emit('add-card', 'left')"
    />
    <ui-button
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="card-list__button card-list__button--bottom"
      @click.stop="emit('add-card', 'right')"
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
.card-list-item.active {
  --card-list-item-bg: var(--color-brown-300);
}
.card-list-item:not(.active):hover {
  --card-list-item-bg: var(--color-brown-200);
}

.card-list-item__options {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s ease-in-out;
}
.card-list-item.active .card-list-item__options,
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
.card-list-item.active .card-list__button {
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
  .card-list-item.active {
    --card-list-item-bg: var(--color-blue-900);
  }
  .card-list-item:not(.active):hover {
    --card-list-item-bg: var(--color-grey-700);
  }
}
</style>

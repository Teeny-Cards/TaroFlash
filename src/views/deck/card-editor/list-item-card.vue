<script setup lang="ts">
import Card from '@/components/card/index.vue'
import ImageButton from '../image-button.vue'
import { useI18n } from 'vue-i18n'
import { setCardImage, deleteCardImage } from '@/api/cards'
import { useToast } from '@/composables/toast'
import { inject, ref, useTemplateRef } from 'vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import textEditor from '@/components/text-editor/text-editor.vue'
import { emitSfx } from '@/sfx/bus'

const FOCUS_DELAY = 1

const { card } = defineProps<{
  card: Card
  duplicate: boolean
}>()

const { t } = useI18n()
const toast = useToast()
const list_item_card = useTemplateRef('list-item-card')
const front_input = useTemplateRef('front-input')

const focused = ref(false)
const focusOutPromise = ref<Promise<void> | null>(null)

const { mode, updateCard } = inject<CardBulkEditor>('card-editor')!

function onUpdate(side: 'front' | 'back', text: string) {
  const update: Partial<Card> = {
    [`${side}_text`]: text
  }

  updateCard(card.id, update)
}

function focusEditor() {
  if (!focused.value) {
    front_input.value?.focus()
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
  } catch (e: any) {
    toast.error(t('card.image-delete-error'))
  }
}

async function onFocus() {
  await focusOutPromise.value

  if (focused.value) {
    emitSfx('ui.click_04')
  } else {
    emitSfx('ui.slide_up')
  }
}

async function onBlur() {
  focusOutPromise.value = new Promise((resolve) =>
    setTimeout(() => {
      focused.value = hasFocusWithin()
      resolve(undefined)
    }, FOCUS_DELAY)
  )
}

function hasFocusWithin() {
  return list_item_card.value?.contains(document.activeElement) ?? false
}

defineExpose({ focusEditor, hasFocusWithin })
</script>

<template>
  <div
    ref="list-item-card"
    data-testid="list-item-card"
    class="flex w-full flex-col justify-center gap-6 md:flex-row"
  >
    <card
      data-testid="front-input"
      :data-id="card.id"
      side="front"
      size="xl"
      mode="edit"
      v-bind="card"
      class="group/card"
      :class="{ 'pointer-events-none': mode === 'select' }"
    >
      <image-button
        class="absolute! -top-2 -left-2 opacity-0 transition-opacity duration-100 ease-in-out group-hover/card:opacity-100"
        :image="card.front_image_path"
        @image-uploaded="onImageUpload('front', $event)"
        @image-deleted="onImageDelete('front')"
        @click.stop
      />

      <template #editor>
        <text-editor
          ref="front-input"
          :content="card.front_text"
          :placeholder="t('common.front')"
          class="w-full h-full"
          @update="onUpdate('front', $event)"
          @focus="onFocus"
          @blur="onBlur"
        />
      </template>
    </card>

    <card
      data-testid="back-input"
      :data-id="card.id"
      side="back"
      size="xl"
      mode="edit"
      v-bind="card"
      class="group/card"
      :class="{ 'pointer-events-none': mode === 'select' }"
    >
      <image-button
        class="absolute! -top-2 -right-2 opacity-0 transition-opacity duration-100 ease-in-out group-hover/card:opacity-100"
        :image="card.back_image_path"
        @image-uploaded="onImageUpload('back', $event)"
        @image-deleted="onImageDelete('back')"
        @click.stop
      />

      <template #editor>
        <text-editor
          ref="back-input"
          :content="card.back_text"
          :placeholder="t('common.back')"
          class="w-full h-full"
          @update="onUpdate('back', $event)"
          @focus="onFocus"
          @blur="onBlur"
        />
      </template>
    </card>
  </div>
</template>

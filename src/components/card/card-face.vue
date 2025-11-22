<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import imageUploader, { type ImageUploadEvent } from '@/components/image-uploader.vue'
import textEditor from '../text-editor.vue'
import { type TextEditorUpdatePayload } from '@/components/text-editor.vue'

const { image, text } = defineProps<{
  image?: string
  text?: string
  editor_delta?: any
  mode?: 'view' | 'edit' | 'select'
  active?: boolean
  side?: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
  (e: 'focusin', event: FocusEvent): void
  (e: 'focusout', event: FocusEvent): void
  (e: 'update', payload: TextEditorUpdatePayload): void
}>()

const { t } = useI18n()

function onFocusIn(e: FocusEvent) {
  emit('focusin', e)
}

function onFocusOut(e: FocusEvent) {
  emit('focusout', e)
}
</script>

<template>
  <div class="card-face" :data-image="!!image" :data-text="!!text" :data-mode="mode">
    <div
      v-if="image && mode !== 'edit'"
      :style="`background-image: url(${image})`"
      class="h-full w-full rounded-(--inner-radius) bg-cover bg-center"
    ></div>

    <text-editor
      :active="!!active"
      :data-testid="`card-face__text-editor__${side}`"
      class="placeholder:text-brown-500 text-brown-700 h-full rounded-(--inner-radius) outline-none"
      :placeholder="t('card.add-text')"
      :delta="editor_delta"
      :disabled="mode !== 'edit'"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @update="emit('update', $event)"
    />
  </div>
</template>

<style>
.card-face {
  --inner-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  width: 100%;
  height: 100%;
  aspect-ratio: var(--aspect-card);
  padding: var(--face-padding);

  border-radius: var(--face-radius);
  border-color: var(--color-brown-300);
  border-width: var(--face-border-width);

  background-color: var(--color-white);
}
.card-face[data-mode='edit']:focus-within {
  outline: 2px solid var(--color-blue-500);
}

.card-face[data-mode='edit'][data-image='false'] {
  grid-template-rows: auto 1fr;
}

.card-face[data-mode='view'][data-image='true'][data-text='false'],
.card-face[data-mode='view'][data-image='false'][data-text='true'] {
  grid-template-rows: 1fr;
}

.card-face[data-mode='edit'] {
  --face-border-width: 0px;
}

.card-face[data-mode='view'][data-text='false'] {
  --face-padding: 0px;
}

.card-face[data-mode='view'][data-text='false'][data-image='false'] {
  background-image: var(--diagonal-stripes);
  background-color: var(--color-purple-400);
}
</style>

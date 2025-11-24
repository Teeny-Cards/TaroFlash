<script setup lang="ts">
import textEditor from '../text-editor.vue'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { image, text } = defineProps<{
  image?: string
  text?: string
  editor_delta?: any
  mode?: 'view' | 'edit' | 'select'
  active?: boolean
  side?: 'front' | 'back'
  placeholder?: string
  uploadImage?: (file: File) => Promise<string | undefined>
}>()

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'update', payload: TextEditorUpdatePayload): void
}>()
</script>

<template>
  <div class="card-face" :data-image="!!image" :data-text="!!text" :data-mode="mode">
    <text-editor
      :active="!!active"
      :data-testid="`card-face__text-editor__${side}`"
      class="placeholder:text-brown-500 text-brown-700 h-full outline-none overflow-y-auto scroll-hidden"
      :placeholder="placeholder"
      :delta="editor_delta"
      :disabled="mode !== 'edit'"
      :upload-image="uploadImage"
      @request-active="emit('focus')"
      @update="emit('update', $event)"
    />
  </div>
</template>

<style>
.card-face {
  --inner-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  width: 100%;
  height: 100%;
  padding: var(--face-padding);

  border-radius: var(--face-radius);
  background-color: var(--color-white);
  background-color: var(--card-bg-color);

  aspect-ratio: var(--aspect-card);
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

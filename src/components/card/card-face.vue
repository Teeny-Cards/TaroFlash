<script setup lang="ts">
import textEditor from '../text-editor/text-editor.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'

const { image, text } = defineProps<{
  image?: string
  text?: string
  mode?: CardEditorMode
  card_defaults?: TextEditorAttributes
}>()
</script>

<template>
  <div class="card-face" :data-image="!!image" :data-text="!!text" :data-mode="mode">
    <img v-if="image" :src="image" class="h-full w-full object-cover" />

    <slot name="editor" v-else>
      <text-editor :content="text" :attributes="card_defaults" disabled class="w-full h-full" />
    </slot>
  </div>
</template>

<style>
.card-face {
  --inner-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  width: 100%;
  height: 100%;
  padding: var(--face-padding);

  border-radius: var(--face-radius);
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

.card-face[data-mode='view'][data-text='false'][data-image='false'],
.card-face[data-mode='view'][data-image='false']:has(.ql-blank) {
  /* background-image: var(--bgx-diagonal-stripes); */
  background-color: var(--color-purple-400);
}

.card-face[data-image='true'] {
  padding: 0;
}

.card-face[data-align='top'] .ql-editor {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.card-face[data-align='center'] .ql-editor {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-face[data-align='bottom'] .ql-editor {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-face__text-editor {
  color: var(--card-text-color);
}
.card-face__text-editor .ql-blank::before {
  color: var(--card-text-color--placeholder);
}
</style>

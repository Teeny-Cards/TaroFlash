<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import imageUploader, { type ImageUploadEvent } from '@/components/image-uploader.vue'

const { image } = defineProps<{
  image?: string
  text?: string
  max_length?: number
  mode?: 'view' | 'edit' | 'select'
}>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
  (e: 'update:text', text: string): void
  (e: 'focusin'): void
  (e: 'focusout'): void
}>()

const { t } = useI18n()

function onTextUpdated(event: Event) {
  emit('update:text', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="card-face" :data-image="!!image" :data-text="!!text" :data-mode="mode">
    <div
      v-if="image && mode !== 'edit'"
      :style="`background-image: url(${image})`"
      class="h-full w-full rounded-(--inner-radius) bg-cover bg-center"
    ></div>

    <image-uploader
      v-else-if="mode === 'edit'"
      @image-uploaded="emit('image-uploaded', $event)"
      class="text-brown-500 group relative h-full min-h-(--min-element-height) w-full"
      :class="{
        'border-brown-300 rounded-(--inner-radius) border border-dashed hover:border-blue-500':
          !image
      }"
    >
      <div
        v-if="image"
        class="h-full w-full rounded-(--inner-radius) bg-cover bg-center"
        :style="`background-image: url(${image})`"
      ></div>

      <div v-else class="flex h-full w-full items-center justify-center gap-2 text-base">
        <ui-kit:icon src="add-image" />
        {{ t('card.add-image') }}
      </div>
    </image-uploader>

    <textarea
      v-if="mode === 'edit'"
      data-testid="card-face__text-input"
      class="placeholder:text-brown-500 text-brown-700 border-brown-300 h-full min-h-(--min-element-height)
        resize-none rounded-(--inner-radius) border border-dashed p-3 text-center outline-none
        hover:border-blue-500 focus:border-blue-500"
      :placeholder="t('card.add-text')"
      :value="text"
      @input="onTextUpdated"
      @focusin="emit('focusin')"
      @focusout="emit('focusout')"
      :maxlength="max_length"
    />

    <div
      v-else-if="!!text"
      data-testid="card-face__text"
      class="text-brown-700 flex h-full w-full items-center justify-center p-3 text-center"
    >
      {{ text }}
    </div>
  </div>
</template>

<style>
.card-face {
  --inner-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  display: grid;
  grid-template-rows: 1fr auto;
  gap: 10px;

  width: 100%;
  height: 100%;
  aspect-ratio: var(--aspect-card);
  padding: var(--face-padding);

  border-radius: var(--face-radius);
  border-color: var(--color-brown-300);
  border-width: var(--face-border-width);

  background-color: var(--color-white);
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

.card-face[data-mode='view'][data-image='false'][data-text='false'] {
  background-color: var(--color-purple-400);
  background-image: var(--diagonal-stripes);
}
</style>

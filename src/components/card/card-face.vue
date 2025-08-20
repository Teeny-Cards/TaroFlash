<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import imageUploader, { type ImageUploadEvent } from '@/components/image-uploader.vue'
import { ref } from 'vue'

const { image } = defineProps<{
  image?: string
  text?: string
  mode?: 'view' | 'edit' | 'select'
}>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
  (e: 'update:text', text: string): void
}>()

const { t } = useI18n()
const image_preview = ref<string | undefined>(image)

function onTextUpdated(event: Event) {
  emit('update:text', (event.target as HTMLDivElement).innerText)
}

function onImageUploaded(event: ImageUploadEvent) {
  image_preview.value = event.preview
  console.log('uploaded')
  emit('image-uploaded', event)
}
</script>

<template>
  <div class="card-face" :data-image="!!image_preview" :data-text="!!text" :data-mode="mode">
    <div
      v-if="image_preview && mode !== 'edit'"
      :style="`background-image: url(${image_preview})`"
      class="h-full w-full rounded-(--inner-radius) bg-cover bg-center"
    ></div>

    <image-uploader
      v-else-if="mode === 'edit'"
      @image-uploaded="onImageUploaded"
      class="text-brown-500 group relative h-full min-h-(--min-element-height) w-full"
      :class="{
        'border-brown-300 rounded-(--inner-radius) border border-dashed hover:border-blue-500':
          !image_preview
      }"
    >
      <div
        v-if="image_preview"
        class="h-full w-full rounded-(--inner-radius) bg-cover bg-center"
        :style="`background-image: url(${image_preview})`"
      ></div>

      <div v-else class="flex h-full w-full items-center justify-center gap-2 text-base">
        <ui-kit:icon src="add-image" />
        {{ t('card.add-image') }}
      </div>
    </image-uploader>

    <div
      v-if="mode === 'edit'"
      data-testid="card-face__text-input"
      class="border-brown-300 placeholder:text-brown-500 text-brown-700 relative h-full
        min-h-(--min-element-height) cursor-text rounded-(--inner-radius) border border-dashed p-3
        text-center hover:border-blue-500"
      @input="onTextUpdated"
    >
      <div contenteditable class="flex h-full w-full items-center justify-center outline-none">
        {{ text }}
      </div>
      <div
        v-if="!text"
        class="text-brown-500 absolute inset-0 flex items-center justify-center select-none"
      >
        {{ t('card.add-text') }}
      </div>
    </div>

    <div v-else-if="!!text" class="flex h-full w-full items-center justify-center text-center">
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

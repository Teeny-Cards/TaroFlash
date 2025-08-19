<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import imageUploader, { type ImageUploadEvent } from '@/components/image-uploader.vue'

defineProps<{
  image?: string
  text?: string
  mode?: 'view' | 'edit' | 'select'
}>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
  (e: 'updated:text', text: string): void
}>()

const { t } = useI18n()

function onTextUpdated(event: Event) {
  emit('updated:text', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div
    class="card-face"
    :class="[`card-face--${mode}`, { 'card-face--has-image': image, 'card-face--has-text': text }]"
  >
    <div class="card-face__image">
      <img :src="image" alt="Deck Image preview" />

      <image-uploader
        v-if="mode === 'edit' && !image"
        @image-uploaded="emit('image-uploaded', $event)"
        class="text-brown-500 relative flex h-full w-full items-center justify-center gap-2 text-base"
      >
        <ui-kit:icon src="add-image" />
        {{ t('card.add-image') }}
      </image-uploader>
    </div>

    <div class="card-face__text">
      <input
        v-if="mode === 'edit'"
        type="text"
        class="card-face__text-input"
        :placeholder="t('card.add-text')"
        :value="text"
        @input="onTextUpdated"
      />
      <p v-else-if="text">{{ text }}</p>
    </div>
  </div>
</template>

<style>
.card-face {
  --inner-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  display: flex;
  flex-direction: column;
  align-items: center;
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

.card-face__image,
.card-face__image img {
  width: 100%;
  height: 100%;
}

.card-face__image img {
  border-radius: var(--inner-radius);
  object-fit: cover;
}

.card-face__text {
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  color: var(--color-brown-700);
  font-size: var(--face-text-size);
  line-height: var(--face-text-size--line-height);
}

.card-face__text-input {
  color: var(--color-brown-700);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
  text-align: center;

  width: 100%;
  height: 100%;
  resize: none;
  outline: none;
  border: none;
  background: none;
}
.card-face__text-input::placeholder {
  color: var(--color-brown-500);
}

.card-face:not(.card-face--has-image):not(.card-face--edit) .card-face__image,
.card-face:not(.card-face--has-image) .card-face__image img {
  display: none;
}

.card-face:not(.card-face--has-image) .card-face__text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.card-face:not(.card-face--has-text):not(.card-face--edit) .card-face__text {
  display: none;
}

.card-face:not(.card-face--has-text):not(.card-face--edit) {
  --face-padding: 0px;
}

.card-face:not(.card-face--has-text):not(.card-face--has-image):not(.card-face--edit) {
  background-color: var(--color-purple-400);
  background-image: var(--diagonal-stripes);
}

/* EDIT MODE */
.card-face--edit {
  --face-border-width: 0px;
}

.card-face--edit .card-face__image {
  border-radius: var(--inner-radius);
  border: 1px dashed var(--color-brown-300);
  width: 100%;
  height: 100px;
  cursor: pointer;
}
.card-face--edit .card-face__image:hover {
  border-color: var(--color-blue-500);
}

.card-face--edit .card-face__text {
  border-radius: var(--inner-radius);
  border: 1px dashed var(--color-brown-300);
  outline: none;
}
.card-face--edit .card-face__text:hover {
  border-color: var(--color-blue-500);
}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from '@/components/card/index.vue'
import imageUploader from '@/components/image-uploader.vue'
import { type ImageUploadEvent } from '@/components/image-uploader.vue'
import { ref } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiLoader from '@/components/ui-kit/loader.vue'

const { t } = useI18n()

const { imageUrl } = defineProps<{ imageUrl?: string }>()

const emit = defineEmits<{
  (e: 'image-uploaded', file: File): void
  (e: 'image-removed'): void
}>()

const title = defineModel<string>('title')

const preview_image = ref<string | undefined>(imageUrl)

function onImageUploaded(event: ImageUploadEvent) {
  preview_image.value = event.preview
  emit('image-uploaded', event.file)
}

function onImageRemoved() {
  preview_image.value = undefined
  emit('image-removed')
}
</script>

<template>
  <div class="relative flex flex-col items-center pb-6">
    <card class="!border-brown-100" :front_image_url="preview_image">
      <image-uploader v-slot="{ trigger, loading, dragging }" @image-uploaded="onImageUploaded">
        <div
          v-if="dragging"
          class="absolute -inset-1.5 rounded-[inherit] border-6 border-blue-400"
        ></div>

        <ui-button
          v-if="!preview_image"
          @click="trigger"
          inverted
          variant="muted"
          icon-left="add-image"
          icon-only
          class="ring-brown-300 absolute -top-4 -left-4 ring-6"
        />

        <ui-button
          v-else
          @click="onImageRemoved"
          inverted
          variant="muted"
          icon-left="remove-image"
          icon-only
          class="ring-brown-300 absolute -top-4 -left-4 ring-6"
        />

        <ui-loader v-if="loading" />
      </image-uploader>
    </card>
    <ui-input
      :placeholder="t('deck.title-placeholder')"
      text-align="center"
      size="lg"
      class="absolute bottom-0"
      v-model:value="title"
    />
  </div>
</template>

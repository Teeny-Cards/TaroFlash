<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/card/index.vue'
import ImageUploader from '@/components/image-uploader.vue'
import { type ImageUploadPayload } from '@/components/image-uploader.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const { t } = useI18n()
const { imageUrl } = defineProps<{ imageUrl?: string }>()

const emit = defineEmits<{
  (e: 'image-uploaded', file: File): void
  (e: 'image-removed'): void
}>()

const title = defineModel<string>('title')
const description = defineModel<string>('description')
const isPublic = defineModel<boolean>('is-public')

const preview_image = ref<string | undefined>(imageUrl)

function onImageUploaded(event: ImageUploadPayload) {
  preview_image.value = event.preview
  emit('image-uploaded', event.file)
}

function onImageRemoved() {
  preview_image.value = undefined
  emit('image-removed')
}
</script>

<template>
  <div class="flex flex-col gap-6 sm:flex-row sm:gap-9">
    <div class="relative flex w-min flex-col items-center pb-6">
      <card face_classes="border-brown-100!" :front_image_url="preview_image">
        <image-uploader v-slot="{ trigger, dragging }" @image-uploaded="onImageUploaded">
          <div
            v-if="dragging"
            class="absolute -inset-1.5 rounded-[inherit] border-6 border-blue-400"
          />
          <ui-button
            v-if="!preview_image"
            theme="brown-100"
            icon-left="add-image"
            icon-only
            class="ring-brown-300 absolute! -top-4 -left-4 ring-6"
            @click="trigger"
          />
          <ui-button
            v-else
            theme="brown-100"
            icon-left="remove-image"
            icon-only
            class="ring-brown-300 absolute! -top-4 -left-4 ring-6"
            @click="onImageRemoved"
          />
        </image-uploader>
      </card>

      <ui-input
        :placeholder="t('deck.title-placeholder')"
        text-align="center"
        size="lg"
        class="absolute bottom-0 left-0 right-0"
        v-model:value="title"
      />
    </div>

    <div class="flex flex-1 flex-col gap-5">
      <ui-input :placeholder="t('deck.description-placeholder')" v-model:value="description" />

      <ui-toggle v-model:checked="isPublic">
        <div class="flex items-center gap-2.5">
          <ui-icon src="public" />
          {{ t('deck.settings-modal.is-public') }}
        </div>
      </ui-toggle>
    </div>
  </div>
</template>

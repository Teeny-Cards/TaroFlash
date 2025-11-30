<script setup lang="ts">
import ImageUploader, { type ImageUploadPayload } from '@/components/image-uploader.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const { image } = defineProps<{
  image?: string
}>()

const emit = defineEmits<{
  (e: 'image-uploaded', file: File): void
  (e: 'image-deleted'): void
}>()

const { t } = useI18n()

async function onImageUpload({ file }: ImageUploadPayload) {
  emit('image-uploaded', file)
}

async function onImageDelete() {
  emit('image-deleted')
}
</script>

<template>
  <image-uploader @image-uploaded="onImageUpload" :allow_drop="false" v-slot="{ trigger }">
    <ui-button v-if="image" icon-only icon-left="delete" theme="red" @click.stop="onImageDelete">
      {{ t('deck-view.item-options.remove-image') }}
    </ui-button>

    <ui-button v-else icon-only icon-left="add-image" theme="orange" @click.stop="trigger">
      {{ t('deck-view.item-options.upload-image') }}
    </ui-button>
  </image-uploader>
</template>

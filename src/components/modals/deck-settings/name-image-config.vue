<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from '@/components/card.vue'
import imageUploader from '@/components/image-uploader.vue'
import { type ImageUploadEvent } from '@/components/image-uploader.vue'
import { computed, ref } from 'vue'
import { getImageUrl } from '@/services/file-service'

const { t } = useI18n()

const { imageName } = defineProps<{
  imageName?: string
}>()

const title = defineModel<string>('title')

const imageData = ref<ImageUploadEvent | undefined>()

function onImageUploaded(event: ImageUploadEvent) {
  imageData.value = event
}

const image_url = computed(() => {
  return imageName ? getImageUrl('deck-images', imageName) : ''
})

const deck_image = computed(() => {
  return imageData.value?.preview ?? image_url.value
})
</script>

<template>
  <div class="relative flex flex-col items-center pb-6">
    <Card class="border-brown-100 border-6" :image_url="deck_image">
      <template #back>
        <image-uploader v-slot="{ trigger, loading }" @image-uploaded="onImageUploaded">
          <ui-kit:button
            v-if="!deck_image"
            @click="trigger"
            inverted
            variant="muted"
            icon-left="add-image"
            icon-only
            class="ring-brown-300 absolute -top-4 -left-4 ring-6"
          />

          <ui-kit:button
            v-else
            @click="imageData = undefined"
            inverted
            variant="muted"
            icon-left="remove-image"
            icon-only
            class="ring-brown-300 absolute -top-4 -left-4 ring-6"
          />

          <ui-kit:loader v-if="loading" />
        </image-uploader>
      </template>
    </Card>
    <ui-kit:input
      :placeholder="t('deck.title-placeholder')"
      text-align="center"
      size="lg"
      class="absolute bottom-0"
      v-model:value="title"
    />
  </div>
</template>

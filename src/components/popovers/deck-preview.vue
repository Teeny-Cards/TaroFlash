<script lang="ts" setup>
import { ref } from 'vue'
import { useModal } from '@/composables/modal'
import deckSettings from '@/components/modals/deck-settings/index.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'

const modal = useModal()

const { deck } = defineProps<{ deck: Deck; imageUrl?: string }>()
const emit = defineEmits<{ (e: 'study'): void; (e: 'updated'): void }>()

const show_image = ref(true)

async function onSettingsClicked() {
  const { response } = modal.open(deckSettings, {
    props: { deck },
    backdrop: true,
    openAudio: 'double-pop-up',
    closeAudio: 'double-pop-down'
  })

  if (await response) {
    emit('updated')
  }
}

function onImageError() {
  show_image.value = false
}
</script>

<template>
  <ui-popover mode="hover" :clip_margin="90" :fallback_placements="['right-end', 'left-end']">
    <template #trigger>
      <slot></slot>
    </template>

    <div
      data-testid="deck-preview"
      class="bg-brown-300 rounded-7 flex w-62.75 cursor-auto flex-col gap-4 overflow-hidden"
      @click.stop
    >
      <div
        data-testid="deck-preview__image"
        class="pointy-bottom-sm relative h-32.75 w-full shrink-0"
      >
        <img
          v-if="imageUrl && show_image"
          :src="imageUrl"
          alt="Deck Image preview"
          class="h-full w-full object-cover"
          @error="onImageError"
        />
        <div v-else class="h-full w-full bg-purple-400 bg-(image:--diagonal-stripes)"></div>
        <ui-button
          icon-left="settings"
          icon-only
          class="absolute! top-4 right-4"
          theme="brown"
          size="sm"
          @click.stop="onSettingsClicked"
        />
      </div>

      <div
        data-testid="deck-preview__content"
        class="flex h-full w-full flex-col justify-between gap-8 px-4 pb-4"
      >
        <div class="flex flex-col gap-2.5">
          <h1 class="text-brown-700 text-3xl">{{ deck.title }}</h1>
          <p class="text-brown-700 text-sm">{{ deck.description }}</p>
        </div>
        <button
          data-testid="deck-preview__study-button"
          class="cursor-pointer rounded-full bg-blue-500 py-2.5 text-white"
          @click.stop="$emit('study')"
        >
          {{ $t('common.study') }}
        </button>
      </div>
    </div>
  </ui-popover>
</template>

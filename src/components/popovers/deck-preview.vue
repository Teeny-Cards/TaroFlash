<script lang="ts" setup>
import { useModal } from '@/composables/use-modal'
import deckSettings from '@/components/modals/deck-settings/index.vue'

const modal = useModal()

const { deck } = defineProps<{ deck: Deck; imageUrl: string }>()
defineEmits<{ (e: 'study'): void }>()

function onSettingsClicked() {
  modal.open(deckSettings, { props: { deck }, backdrop: true })
}
</script>

<template>
  <ui-kit:popover>
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
          v-if="imageUrl"
          :src="imageUrl"
          alt="Deck Image preview"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full bg-purple-400 bg-(image:--diagonal-stripes)"></div>
        <ui-kit:button
          icon-left="settings"
          icon-only
          class="absolute top-4 right-4"
          inverted
          variant="muted"
          size="small"
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
  </ui-kit:popover>
</template>

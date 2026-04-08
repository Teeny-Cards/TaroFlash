<script setup lang="ts">
import Deck from '@/components/deck.vue'
import UiButton from '@/components/ui-kit/button.vue'

const { deck } = defineProps<{ deck: Deck }>()

const emit = defineEmits<{
  (e: 'started'): void
  (e: 'closed'): void
}>()
</script>

<template>
  <div data-testid="start-screen" class="flex flex-col items-center justify-between w-full h-full">
    <div
      class="relative flex w-full justify-center bg-purple-500 wave-bottom-[50px] bgx-diagonal-stripes bgx-size-20 bg-center px-13 py-11.5 pb-14 z-10"
    >
      <div class="absolute top-0 left-0 p-4">
        <ui-button
          icon-left="close"
          theme="purple-500"
          inverted
          icon-only
          @click="emit('closed')"
        />
      </div>
      <h1 class="text-5xl text-white">{{ deck?.title }}</h1>
    </div>

    <div class="w-full h-full flex flex-col items-center justify-center gap-10">
      <deck :deck="deck" size="2xl" hide_title />

      <ui-button icon-left="play" size="xl" @click="emit('started')"> Start </ui-button>
    </div>
  </div>
</template>

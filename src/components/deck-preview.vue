<script lang="ts" setup>
defineProps<{ deck: Deck; imageUrl: string }>()
defineEmits<{ (e: 'study'): void }>()
</script>

<template>
  <ui-kit:popover>
    <div
      data-testid="deck-preview"
      class="bg-parchment-dark rounded-7 flex h-87.5 w-62.75 flex-col gap-4 overflow-hidden"
    >
      <div data-testid="deck-preview__image" class="pointy-bottom-sm h-32.75 w-full shrink-0">
        <img :src="imageUrl" alt="Deck Image preview" class="h-full w-full object-cover" />
      </div>

      <div
        data-testid="deck-preview__content"
        class="flex h-full w-full flex-col justify-between px-4 pb-4"
      >
        <div class="flex flex-col gap-2.5">
          <h1 class="text-brown-dark text-3xl">{{ deck.title }}</h1>
          <p class="text-brown-dark text-sm">{{ deck.description }}</p>
        </div>
        <button
          data-testid="deck-preview__study-button"
          class="bg-blue cursor-pointer rounded-full py-2.5 text-white"
          @click="$emit('study')"
        >
          {{ $t('common.study') }}
        </button>
      </div>
    </div>

    <template #arrow="{ positions }">
      <div
        class="bg-parchment-dark rounded-1 -z-10 h-5 w-5 rotate-45"
        :style="{
          position: 'absolute',
          left: positions.left,
          top: positions.top
        }"
      ></div>
    </template>
  </ui-kit:popover>
</template>

<template>
  <ui-kit:modal open backdrop>
    <div
      data-testid="study-modal"
      class="bg-parchment-dark rounded-8 flex flex-col items-center pb-6 overflow-hidden w-268 h-170 shadow-modal"
    >
      <div
        data-testid="study-modal__header"
        class="w-full px-13 py-11.5 bg-purple-dark bg-(image:--diagonal-stripes) pointy-bottom bg-(length:--bg-sm) flex justify-center"
      >
        <h1 class="text-white text-3xl">Studying Chinese Characters</h1>
      </div>

      <div data-testid="study-modal__body" class="flex gap-4 justify-center h-full items-center">
        <Card size="large">Front</Card>
        <Card size="large">Back</Card>
      </div>

      <div
        data-testid="study-modal__track"
        class="flex gap-1 max-w-189 overflow-x-auto scroll-hidden border-x border-dashed border-grey py-2 px-1 shrink-0"
      >
        <div
          v-for="i in 52"
          :key="i"
          class="min-w-4.75 w-4.75 aspect-card bg-parchment rounded-1.5"
        ></div>
      </div>

      <div data-testid="study-modal__count">
        <p class="text-brown-dark text-base">31<span class="text-xs">/52</span></p>
      </div>
    </div>
  </ui-kit:modal>
</template>

<script lang="ts" setup>
import Card from '@/components/card.vue'
</script>

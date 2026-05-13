<script setup lang="ts">
import Card from '@/components/card/index.vue'

type CardSize = InstanceType<typeof Card>['$props']['size']

const { deck, size = 'base' } = defineProps<{
  deck?: Deck
  size?: CardSize
  hide_title?: boolean
}>()
</script>

<template>
  <div
    data-testid="deck-thumbnail"
    class="deck-thumbnail--outline pointer-fine:hover:scale-101 relative cursor-pointer h-min transition-all duration-75"
    v-sfx.hover="'ui.click_07'"
  >
    <card side="cover" :size="size" :cover_config="deck?.cover_config" />

    <div
      v-if="!hide_title"
      class="absolute w-full -bottom-2.5 bg-brown-300 dark:bg-stone-700 p-4 rounded-5.5"
    >
      <slot name="actions"></slot>
      <h2 class="text-xl text-center text-brown-700 dark:text-brown-100">{{ deck?.title }}</h2>
    </div>
  </div>
</template>

<style scoped>
@media (pointer: fine) {
  .deck-thumbnail--outline:hover {
    --outline-color: var(--color-white);
    --outline-size: 2px;
    --outline-size--inset: calc(var(--outline-size) * -1);
    --outline-diag: calc(var(--outline-size) * 0.7071);
    --outline-diag--inset: calc(var(--outline-diag) * -1);

    filter: drop-shadow(var(--outline-size) 0 0 var(--outline-color))
      drop-shadow(var(--outline-size--inset) 0 0 var(--outline-color))
      drop-shadow(0 var(--outline-size) 0 var(--outline-color))
      drop-shadow(0 var(--outline-size--inset) 0 var(--outline-color))
      drop-shadow(var(--outline-diag) var(--outline-diag) 0 var(--outline-color))
      drop-shadow(var(--outline-diag--inset) var(--outline-diag) 0 var(--outline-color))
      drop-shadow(var(--outline-diag) var(--outline-diag--inset) 0 var(--outline-color))
      drop-shadow(var(--outline-diag--inset) var(--outline-diag--inset) 0 var(--outline-color));
  }
}
</style>

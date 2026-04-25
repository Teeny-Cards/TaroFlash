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
  <div data-testid="deck" class="relative cursor-pointer h-min">
    <card side="cover" :size="size" :cover_config="deck?.cover_config" />

    <div
      v-if="!hide_title"
      class="absolute w-full -bottom-2.5 bg-brown-300 dark:bg-grey-800 px-3 py-2 rounded-4.5"
    >
      <h2 class="text-lg text-center text-brown-700 dark:text-brown-100">{{ deck?.title }}</h2>
    </div>
  </div>
</template>

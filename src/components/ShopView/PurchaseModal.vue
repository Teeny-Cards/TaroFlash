<template>
  <div
    class="bg-parchment-dark rounded-31 shadow-modal flex h-156 w-149 flex-col items-center justify-between
      gap-16 p-15"
  >
    <div class="flex flex-col items-center gap-4">
      <ui-kit:image :src="item.item_key" class="h-41 w-41" />
      <h2 class="text-brown-dark text-5xl">{{ item.name }}</h2>
      <p class="text-grey text-center text-xl">{{ item.description }}</p>
    </div>
    <ui-kit:button icon-left="check" @click="purchase">Purchase</ui-kit:button>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'

const emit = defineEmits<{
  (e: 'purchased', item: ShopItem): void
}>()

const props = defineProps({
  item: {
    type: Object as PropType<ShopItem>,
    required: true
  }
})

function purchase(): void {
  emit('purchased', props.item)
}
</script>

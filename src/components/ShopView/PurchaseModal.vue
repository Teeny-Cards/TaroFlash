<template>
  <div
    class="bg-parchment-dark p-15 rounded-31 flex flex-col gap-16 items-center justify-between w-149 h-156 shadow-modal"
  >
    <div class="flex flex-col items-center gap-4">
      <ui-kit:image :src="item.item_key" class="w-41 h-41" />
      <h2 class="text-3xl text-brown-dark">{{ item.name }}</h2>
      <p class="text-lg text-grey text-center">{{ item.description }}</p>
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

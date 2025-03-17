<template>
  <div
    class="bg-parchment-dark p-15 rounded-31 flex flex-col gap-16 items-center justify-between w-149 h-156 shadow-modal"
  >
    <div class="flex flex-col items-center gap-4">
      <TeenyImage :src="`items/${item.item_key}.svg`" class="w-41 h-41" />
      <h2 class="text-3xl text-brown-dark">{{ item.name }}</h2>
      <p class="text-lg text-grey text-center">{{ item.description }}</p>
    </div>
    <TeenyButton icon-left="check" @click="purchase">Purchase</TeenyButton>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import TeenyImage from '@teeny/TeenyImage.vue'
import TeenyButton from '@teeny/TeenyButton.vue'

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

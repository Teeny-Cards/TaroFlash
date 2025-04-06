<template>
  <div
    class="grid grid-cols-[165px] grid-rows-[148px_29px_34px_46px] justify-items-center items-start cursor-pointer relative group"
  >
    <div
      class="absolute -inset-4 rounded-8 group-hover:bg-parchment-dark -z-1 transition-colors duration-75"
    ></div>
    <TeenyImage class="w-29 h-29" :src="item.item_key" />
    <p class="text-xl text-center text-brown-dark">{{ item.name }}</p>
    <p class="shop-item__description text-xs text-center text-grey w-32 h-8.5">
      {{ item.description }}
    </p>
    <div class="flex items-center self-center">
      <TeenyIcon src="paperclip" size="small" class="text-blue" />
      <p class="text-sm text-center text-brown-dark">{{ item.price }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyIcon from '@teeny/TeenyIcon.vue'
import TeenyImage from '@teeny/TeenyImage.vue'
import { type PropType } from 'vue'

defineProps({
  item: {
    type: Object as PropType<ShopItem>,
    required: true
  }
})
</script>

<style scoped>
.shop-item__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

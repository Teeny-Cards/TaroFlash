<template>
  <div
    class="group relative grid cursor-pointer grid-cols-[165px] grid-rows-[148px_29px_34px_46px] items-start justify-items-center"
  >
    <div
      class="rounded-8 group-hover:bg-parchment-dark absolute -inset-4 -z-1 transition-colors duration-75"
    ></div>
    <ui-kit:image class="h-29 w-29" :src="item.item_key" />
    <p class="text-brown-dark text-center text-xl">{{ item.name }}</p>
    <p class="shop-item__description text-grey h-8.5 w-32 text-center text-xs">
      {{ item.description }}
    </p>
    <div class="flex items-center self-center">
      <ui-kit:icon src="paperclip" size="small" class="text-blue" />
      <p class="text-brown-dark text-center text-sm">{{ item.price }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

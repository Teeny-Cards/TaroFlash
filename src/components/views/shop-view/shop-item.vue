<template>
  <div
    class="group relative grid cursor-pointer grid-cols-[165px] grid-rows-[148px_29px_34px_46px] items-start
      justify-items-center"
  >
    <div
      class="rounded-8 group-hover:bg-brown-300 absolute -inset-4 -z-1 transition-colors duration-75"
    ></div>
    <ui-image class="h-29 w-29" :src="item.item_key" />
    <p class="text-brown-700 text-center text-2xl">{{ item.name }}</p>
    <p class="shop-item__description text-grey-500 h-8.5 w-32 text-center text-sm">
      {{ item.description }}
    </p>
    <div class="flex items-center self-center">
      <ui-icon src="paperclip" size="small" class="text-blue-500" />
      <p class="text-brown-700 text-center text-base">{{ item.price }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import UiImage from '@/components/ui-kit/image.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

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

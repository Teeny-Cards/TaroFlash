<template>
  <TeenyModal open backdrop>
    <div class="bg-parchment-dark rounded-10 w-254 h-163 flex flex-col">
      <div class="w-full flex justify-center items-center py-5">
        <h2 class="text-4xl text-brown-dark">Inventory</h2>
      </div>
      <div class="h-full flex gap-7 p-7 bg-parchment">
        <div class="bg-parchment-dark rounded-6 w-78.75 h-full"></div>
        <div class="grid grid-cols-4 gap-3.5">
          <div
            v-for="purchase in purchases"
            :key="purchase.id"
            class="w-34 h-34 bg-parchment-dark rounded-4 p-2.5 cursor-pointer relative hover:ring-4 hover:ring-blue transition-all"
          >
            <TeenyImage :src="purchase.shop_item.item_key" class="w-full h-full" />
            <div
              class="absolute bottom-2 right-2 text-white bg-blue rounded-full flex justify-center items-center w-6.75 h-6.75 outline-4 outline-parchment-dark"
            >
              {{ purchase.quantity }}
            </div>
          </div>
          <div
            v-for="i in empty_slots"
            :key="i"
            class="w-34 h-34 border-2 border-parchment-dark rounded-4 border-dashed"
          ></div>
        </div>
      </div>
      <div class="h-21.25 w-full"></div>
    </div>
  </TeenyModal>
</template>

<script setup lang="ts">
import TeenyModal from '@teeny/TeenyModal.vue'
import TeenyImage from './TeenyComponents/TeenyImage.vue'
import { fetchPurchaseItems } from '@/services/shopService'
import { computed, onMounted, ref } from 'vue'

const INV_SLOTS = 12
const purchases = ref<PurchaseItem[]>([])
const empty_slots = computed(() => INV_SLOTS - purchases.value.length)

onMounted(async () => {
  purchases.value = await fetchPurchaseItems()
})
</script>

<template>
  <ui-kit:modal open backdrop>
    <div class="bg-brown-300 rounded-10 flex h-163 w-254 flex-col">
      <div class="flex w-full items-center justify-center py-5">
        <h2 class="text-brown-700 text-6xl">Inventory</h2>
      </div>
      <div class="bg-brown-100 flex h-full gap-7 p-7">
        <div class="bg-brown-300 rounded-6 h-full w-78.75"></div>
        <div class="grid grid-cols-4 gap-3.5">
          <div v-for="purchase in purchases" :key="purchase.id" class="bg-brown-300 rounded-4 relative h-34 w-34 cursor-pointer p-2.5 transition-all hover:ring-4
              hover:ring-blue-500">
            <ui-kit:image :src="purchase.shop_item.item_key" class="h-full w-full" />
            <div class="outline-brown-100-dark absolute right-2 bottom-2 flex h-6.75 w-6.75 items-center justify-center
                rounded-full bg-blue-500 text-white outline-4">
              {{ purchase.quantity }}
            </div>
          </div>
          <div v-for="i in empty_slots" :key="i" class="border-brown-300 rounded-4 h-34 w-34 border-2 border-dashed">
          </div>
        </div>
      </div>
      <div class="h-21.25 w-full"></div>
    </div>
  </ui-kit:modal>
</template>

<script setup lang="ts">
import { fetchPurchaseItems } from '@/services/shop-service'
import { computed, onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores/member'

const INV_SLOTS = 12
const purchases = ref<PurchaseItem[]>([])
const memberStore = useMemberStore()
const empty_slots = computed(() => INV_SLOTS - purchases.value.length)

onMounted(async () => {
  if (!memberStore.id) {
    return
  }

  purchases.value = await fetchPurchaseItems(memberStore.id)
})
</script>

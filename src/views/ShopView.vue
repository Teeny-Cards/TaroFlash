<template>
  <div class="flex flex-col gap-16 items-center pt-4">
    <div class="w-full h-34 bg-orange rounded-4"></div>
    <div class="w-full flex flex-col gap-2.5 items-center justify-center">
      <div class="flex gap-2.5 items-center">
        <h2 class="nav-item bg-pink selected">Power Ups</h2>
        <h2 class="nav-item bg-orange">Stationary</h2>
        <h2 class="nav-item bg-green">Stickers</h2>
        <h2 class="nav-item bg-arctic">Misclaneous</h2>
      </div>
      <p class="text-brown-dark">
        Power ups can be used to gain an edge and score more paper clips.
      </p>
    </div>
    <div class="flex flex-col gap-16">
      <div class="flex gap-13 justify-center w-full">
        <ShopItem
          v-for="item in shop_items.power_ups"
          :key="item.name"
          :item="item"
          @click="selected_item = item"
        />
      </div>
      <div class="w-full h-0.25 bg-brown-light"></div>
      <div class="flex gap-13 justify-center w-full">
        <ShopItem
          v-for="item in shop_items.stationary"
          :key="item.name"
          :item="item"
          @click="selected_item = item"
        />
      </div>
    </div>
  </div>

  <ui-kit:modal :open="selected_item !== undefined" @close="selected_item = undefined">
    <PurchaseModal :item="selected_item!" @purchased="submitPurchase(selected_item!)" />
  </ui-kit:modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ShopItem from '@/components/ShopView/ShopItem.vue'
import { fetchShopItems, upsertPurchase } from '@/services/shopService'
import PurchaseModal from '@/components/ShopView/PurchaseModal.vue'
import { useMemberStore } from '@/stores/member'

const shop_items = ref<{ [key: string]: ShopItem[] }>({})
const selected_item = ref<ShopItem | undefined>()
const memberStore = useMemberStore()

onMounted(async () => {
  const items = await fetchShopItems()

  if (items) {
    shop_items.value = groupItemsByCategory(items)
  }
})

function groupItemsByCategory(items: ShopItem[]) {
  return items.reduce((acc: { [key: string]: ShopItem[] }, item: ShopItem) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }

    acc[item.category].push(item)
    return acc
  }, {})
}

async function submitPurchase(item: ShopItem) {
  await upsertPurchase({
    item_id: item.id,
    member_id: memberStore.id,
    quantity: 1
  })

  selected_item.value = undefined
}
</script>

<style scoped>
.nav-item {
  font-size: 32px;
  font-family: var(--font-primary);
  color: transparent;
  border-radius: 16px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
}
.nav-item:hover,
.nav-item.selected {
  color: var(--color-white);
  padding: 2px 32px;
  border-radius: 22px;
  width: auto;
  height: auto;
}
</style>

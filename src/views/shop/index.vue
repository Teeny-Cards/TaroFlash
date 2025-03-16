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
        <ShopItem v-for="item in power_ups" :key="item.name" :item="item" />
      </div>
      <div class="w-full h-0.25 bg-brown-light"></div>
      <div class="flex gap-13 justify-center w-full">
        <ShopItem v-for="item in stationary" :key="item.name" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopItem from './components/ShopItem.vue'
import { power_ups, stationary } from '@/data/shopItems'
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

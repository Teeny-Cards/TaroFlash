<template>
  <label class="flex cursor-pointer items-center justify-between gap-2">
    <span class="text-brown-700">
      <slot></slot>
    </span>

    <span
      class="flex w-12 items-center rounded-full p-1 transition-colors"
      :class="{ 'bg-green-400': checked, 'bg-white': !checked }"
    >
      <input type="checkbox" v-model="checked" class="hidden" />
      <span
        class="h-5 w-5 rounded-full transition-all"
        :class="{ 'translate-x-full transform bg-white': checked, 'bg-brown-500': !checked }"
      ></span>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()

const checked = defineModel<boolean>('checked')
</script>

<script setup lang="ts" generic="T extends string | number">
type TabBarProps<V> = {
  tabs: { value: V; label: string }[]
  active: V
}

defineProps<TabBarProps<T>>()

defineEmits<{
  (e: 'update:active', value: T): void
}>()
</script>

<template>
  <div
    data-testid="tab-bar"
    class="inline-flex gap-1 p-1 rounded-2.5 bg-brown-200 dark:bg-grey-900"
  >
    <button
      v-for="tab in tabs"
      :key="String(tab.value)"
      type="button"
      data-testid="tab-bar__tab"
      :data-active="tab.value === active"
      class="py-1.5 px-3.5 rounded-2 text-sm cursor-pointer text-brown-500 data-[active=true]:bg-brown-500 data-[active=true]:text-brown-100 dark:data-[active=true]:bg-grey-700 dark:data-[active=true]:text-brown-300"
      @click="$emit('update:active', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

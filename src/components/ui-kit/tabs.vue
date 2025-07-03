<script lang="ts" setup>
type Tab = {
  label: string
  icon?: string
}

defineProps<{
  tabs: Tab[]
}>()
</script>

<template>
  <div data-testid="ui-kit-tabs" class="flex w-full items-center justify-between gap-2.5">
    <div data-testid="ui-kit-tabs__tabs" class="flex items-center gap-1.5">
      <div
        v-for="tab in tabs"
        data-testid="ui-kit-tabs__tab"
        class="rounded-4 flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-xl text-white"
      >
        <slot :tab="tab">
          <ui-kit:icon v-if="tab.icon" :src="tab.icon" />
          <span>{{ tab.label }}</span>
        </slot>
      </div>
    </div>

    <div data-testid="ui-kit-tabs__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style>
[data-testid='ui-kit-tabs__tab'] {
  background-color: var(--color-pink-400);
}
[data-testid='ui-kit-tabs__tab']:nth-child(2) {
  background-color: var(--color-purple-400);
}
[data-testid='ui-kit-tabs__tab']:nth-child(3) {
  background-color: var(--color-orange-400);
}
[data-testid='ui-kit-tabs__tab']:nth-child(4) {
  background-color: var(--color-green-400);
}
[data-testid='ui-kit-tabs__tab']:nth-child(5) {
  background-color: var(--color-blue-400);
}
</style>

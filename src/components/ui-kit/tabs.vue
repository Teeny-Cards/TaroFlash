<script lang="ts" setup>
import { useStorage } from '@/composables/storage'
import { onMounted } from 'vue'
import UiIcon from '@/components/ui-kit/icon.vue'

type Tab = {
  label: string
  icon?: string
}

const { storageKey } = defineProps<{
  tabs: Tab[]
  storageKey?: string
}>()
const emit = defineEmits<{
  (e: 'update:activeTab', index: number): void
}>()

const active_tab = defineModel<number>('activeTab')
const storage = useStorage()

onMounted(() => {
  if (!storageKey) return

  const storedValue = storage.get(storageKey)
  if (storedValue) {
    emit('update:activeTab', Number(storedValue))
  }
})

function onTabClick(index: number) {
  if (active_tab.value === index) {
    return
  }

  if (storageKey) {
    storage.set(storageKey, index.toString())
  }

  emit('update:activeTab', index)
}
</script>

<template>
  <div data-testid="ui-kit-tabs__tabs" class="ui-kit-tabs">
    <div
      v-for="(tab, index) in tabs"
      data-testid="ui-kit-tabs__tab"
      class="ui-kit-tabs__tab"
      :class="{ 'ui-kit-tabs__tab--active': active_tab === index }"
      @click="onTabClick(index)"
    >
      <ui-icon v-if="tab.icon" :src="tab.icon" size="small" class="ui-kit-tabs__tab-icon" />
      <span class="ui-kit-tabs__tab-label">{{ tab.label }}</span>

      <span v-if="active_tab !== index" class="ui-kit-tabs__tab-tooltip shadow-xs">
        {{ tab.label }}
      </span>
    </div>
  </div>
</template>

<style>
.ui-kit-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

.ui-kit-tabs__tab {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  min-height: 32px;
  min-width: 32px;
  padding: 6px;
  border-radius: var(--radius-3_5);
  background-color: var(--color-pink-400);

  transition: width 75ms ease-in-out;
  cursor: pointer;
}

.ui-kit-tabs__tab:nth-child(2) {
  background-color: var(--color-purple-400);
}
.ui-kit-tabs__tab:nth-child(3) {
  background-color: var(--color-orange-400);
}
.ui-kit-tabs__tab:nth-child(4) {
  background-color: var(--color-green-400);
}
.ui-kit-tabs__tab:nth-child(5) {
  background-color: var(--color-blue-500);
}

.ui-kit-tabs__tab.ui-kit-tabs__tab--active {
  height: auto;
  width: auto;
  padding: 6px 12px;
}

.ui-kit-tabs__tab-icon {
  flex-shrink: 0;
  color: var(--color-white);
}

.ui-kit-tabs__tab-label {
  position: absolute;
  color: transparent;
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.ui-kit-tabs__tab--active .ui-kit-tabs__tab-label {
  position: static;
  color: var(--color-white);
}

.ui-kit-tabs__tab-tooltip {
  display: none;
  position: absolute;
  top: -22px;

  border-radius: var(--radius-full);
  padding: 6px 8px;

  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-brown-700);
  white-space: nowrap;
  background-color: var(--color-white);
}

.ui-kit-tabs__tab:hover .ui-kit-tabs__tab-tooltip {
  display: block;
}
</style>

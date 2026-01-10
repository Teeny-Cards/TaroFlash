<script lang="ts" setup>
import { useStorage } from '@/composables/storage'
import { onMounted } from 'vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import { emitHoverSfx, emitSfx } from '@/sfx/bus'

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

  emitSfx('ui.etc_camera_shutter')
  emit('update:activeTab', index)
}

function onHover(index: number) {
  if (active_tab.value === index) return
  emitHoverSfx('ui.click_04')
}
</script>

<template>
  <div data-testid="ui-kit-tabs" class="ui-kit-tabs">
    <ui-tooltip
      v-for="(tab, index) in tabs"
      data-testid="ui-kit-tabs__tab"
      theme="white"
      :gap="-4"
      :disabled="active_tab === index"
      class="ui-kit-tabs__tab"
      :text="tab.label"
      :class="{ 'ui-kit-tabs__tab--active': active_tab === index }"
      @click="onTabClick(index)"
      @mouseenter="onHover(index)"
    >
      <ui-icon v-if="tab.icon" :src="tab.icon" size="small" class="ui-kit-tabs__tab-icon" />
      <span class="ui-kit-tabs__tab-label">{{ tab.label }}</span>
    </ui-tooltip>
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

.ui-kit-tabs__tab:nth-child(2 of .ui-kit-tabs__tab) {
  background-color: var(--color-purple-400);
}
.ui-kit-tabs__tab:nth-child(3 of .ui-kit-tabs__tab) {
  background-color: var(--color-orange-400);
}
.ui-kit-tabs__tab:nth-child(4 of .ui-kit-tabs__tab) {
  background-color: var(--color-green-400);
}
.ui-kit-tabs__tab:nth-child(5 of .ui-kit-tabs__tab) {
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
</style>

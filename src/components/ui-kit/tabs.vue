<script lang="ts" setup>
import { useAudio } from '@/composables/use-audio'

type Tab = {
  label: string
  icon?: string
}

defineProps<{ tabs: Tab[] }>()
const emit = defineEmits<{
  (e: 'update:activeTab', index: number): void
}>()

const active_tab = defineModel<number>('activeTab')
const audio = useAudio()

function onTabClick(index: number) {
  if (active_tab.value === index) {
    audio.play('digi_powerdown')
    return
  }

  audio.play('etc_camera_shutter')
  emit('update:activeTab', index)
}

function onTabHover(active: boolean) {
  if (!active) audio.play('click_07')
}
</script>

<template>
  <div data-testid="ui-kit-tabs__tabs" class="ui-kit-tabs">
    <div
      v-for="(tab, index) in tabs"
      data-testid="ui-kit-tabs__tab"
      class="ui-kit-tabs__tab group"
      :class="{ 'ui-kit-tabs__tab--active': active_tab === index }"
      @click="onTabClick(index)"
      @mouseenter="onTabHover(active_tab === index)"
    >
      <ui-kit:icon v-if="tab.icon" :src="tab.icon" class="ui-kit-tabs__tab-icon" />
      <span class="ui-kit-tabs__tab-label">{{ tab.label }}</span>

      <span v-if="active_tab !== index" class="ui-kit-tabs__tab-tooltip">
        {{ tab.label }}
      </span>
    </div>
  </div>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-tabs {
  @apply flex items-center gap-1.5 select-none;
}

.ui-kit-tabs__tab {
  @apply flex items-center justify-center gap-2.5;
  @apply transition-[width] duration-75 ease-in-out;
  @apply rounded-4 h-9.5 w-9.5 px-3 py-1.5;
  @apply relative cursor-pointer bg-pink-400;
}

.ui-kit-tabs__tab:nth-child(2) {
  @apply bg-purple-400;
}
.ui-kit-tabs__tab:nth-child(3) {
  @apply bg-orange-400;
}
.ui-kit-tabs__tab:nth-child(4) {
  @apply bg-green-400;
}
.ui-kit-tabs__tab:nth-child(5) {
  @apply bg-blue-400;
}

.ui-kit-tabs__tab.ui-kit-tabs__tab--active {
  @apply h-auto w-auto;
}

.ui-kit-tabs__tab-icon {
  @apply shrink-0 text-white;
}

.ui-kit-tabs__tab-label {
  @apply absolute;
  @apply text-xl text-transparent;
}

.ui-kit-tabs__tab--active .ui-kit-tabs__tab-label {
  @apply static;
  @apply text-white;
}

.ui-kit-tabs__tab-tooltip {
  @apply absolute -top-6;
  @apply rounded-full p-2;
  @apply text-brown-700 text-sm;
  @apply hidden group-hover:block;
  @apply shadow-button bg-white whitespace-nowrap;
}
</style>

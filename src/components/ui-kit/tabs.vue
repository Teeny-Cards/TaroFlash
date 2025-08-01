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

<script setup lang="ts">
import UiImage from '@/components/ui-kit/image.vue'
import Widget from '@/phone/components/widget.vue'
import { ref, computed } from 'vue'
import { emitSfx } from '@/sfx/bus'

type Mode = 'system' | 'light' | 'dark'

type ModeConfig = {
  label: string
  theme: MemberTheme
}

const active_mode = ref<Mode>('system')

const modes = computed<{ [key in Mode]: ModeConfig }>(() => ({
  system: { label: 'System', theme: 'purple-500' },
  light: { label: 'Light', theme: 'orange-600' },
  dark: { label: 'Dark', theme: 'grey-900' }
}))

const active_mode_config = computed(() => modes.value[active_mode.value])
const theme = computed(() => active_mode_config.value.theme)
const title = computed(() => `${active_mode_config.value.label} Theme`)

function cycleMode() {
  const index = Object.keys(modes.value).indexOf(active_mode.value)
  const next = (index + 1) % Object.keys(modes.value).length
  active_mode.value = Object.keys(modes.value)[next] as Mode
  emitSfx('ui.etc_camera_shutter')
}
</script>

<template>
  <widget :theme="theme" :title="title" @click="cycleMode">
    <ui-image v-if="active_mode === 'system'" src="darkmode-system" />
    <ui-image v-else-if="active_mode === 'light'" src="darkmode-light" />
    <ui-image v-else src="darkmode-dark" />
  </widget>
</template>

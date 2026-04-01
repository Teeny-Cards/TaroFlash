<script setup lang="ts">
import UiImage from '@/components/ui-kit/image.vue'
import Widget from '@/phone/components/widget.vue'
import { computed } from 'vue'
import { useTheme, type ThemeMode } from '@/composables/use-theme'
import { emitSfx } from '@/sfx/bus'

type ModeConfig = {
  label: string
  theme: MemberTheme
}

const { cycle, mode } = useTheme()

const modes = computed<{ [key in ThemeMode]: ModeConfig }>(() => ({
  system: { label: 'System', theme: 'purple-500' },
  light: { label: 'Light', theme: 'orange-600' },
  dark: { label: 'Dark', theme: 'blue-650' }
}))

const active_mode_config = computed(() => modes.value[mode.value])
const theme = computed(() => active_mode_config.value.theme)
const title = computed(() => `${active_mode_config.value.label} Theme`)

function cycleMode() {
  cycle()
  emitSfx('ui.select')
}
</script>

<template>
  <widget :theme="theme" :title="title" @click="cycleMode">
    <ui-image v-if="mode === 'system'" src="darkmode-system" />
    <ui-image v-else-if="mode === 'light'" src="darkmode-light" />
    <ui-image v-else src="darkmode-dark" />
  </widget>
</template>

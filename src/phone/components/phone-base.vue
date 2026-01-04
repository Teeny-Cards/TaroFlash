<script setup lang="ts">
import AppLauncher from '@/phone/components/app-launcher.vue'
import { type PhoneApp } from '@/phone/system/types'
import { type AppSession } from '@/phone/system/runtime'
import { computed } from 'vue'
import { type TransitionPreset } from '@/phone/system/phone-navigator'

const { active_session } = defineProps<{
  apps: PhoneApp[]
  transition: TransitionPreset
  transitioning: boolean
  active_session: AppSession | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const app = computed(() => {
  return active_session?.app.type === 'view' ? active_session.app : null
})

const controller = computed(() => {
  return active_session?.controller
})
</script>

<template>
  <div
    data-testid="phone-base"
    class="absolute top-0 right-0 pointer-events-auto w-60 h-89.5 bg-brown-300 shadow-sm rounded-16
      translate-y-7 overflow-hidden"
  >
    <app-launcher v-if="!app" :apps="apps" :transitioning="transitioning" @close="emit('close')" />

    <transition :name="transition">
      <component
        v-if="app?.component"
        :is="app.component"
        @controller="controller"
        @close="emit('close')"
      />
    </transition>
  </div>
</template>

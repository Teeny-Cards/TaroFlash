<script setup lang="ts">
import AppLauncher from '@/phone/components/app-launcher.vue'
import { type PhoneApp, type PhoneContext, type PhoneRuntime } from '@/phone/system/types'
import { computed, inject } from 'vue'

const { runtime } = defineProps<{
  apps: PhoneApp[]
  runtime?: PhoneRuntime
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const phone_context = inject<PhoneContext>('phone-context')
const nav = phone_context?.nav

const current_app = computed(() => phone_context?.nav.top.value)

const current_controller = computed(() => {
  if (!current_app.value) return
  return runtime?.getController(current_app.value?.id)
})
</script>

<template>
  <div
    data-testid="phone-base"
    class="absolute top-0 right-0 pointer-events-auto w-60 h-89.5 bg-brown-300 shadow-sm rounded-16
      translate-y-7"
  >
    <app-launcher v-if="!current_app" :apps="apps" :runtime="runtime" @close="emit('close')" />

    <transition :name="nav?.transitionName.value">
      <component
        v-if="current_app"
        :is="current_app.component"
        @controller="current_controller"
        @close="emit('close')"
      />
    </transition>
  </div>
</template>

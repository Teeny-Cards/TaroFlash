<script setup lang="ts">
import AppLauncher from '@/phone/components/app-launcher.vue'
import { type PhoneApp, type PhoneContext } from '@/phone/system/types'
import { computed, inject } from 'vue'

defineProps<{
  apps: PhoneApp[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const phone_context = inject<PhoneContext>('phone-context')
const nav = phone_context?.nav

const current_app = computed(() => phone_context?.nav.top.value)
</script>

<template>
  <div
    data-testid="phone-base"
    class="absolute top-0 right-0 pointer-events-auto w-60 h-89.5 bg-brown-300 shadow-sm rounded-16
      translate-y-7"
  >
    <app-launcher v-if="!current_app" :apps="apps" @close="emit('close')" />

    <transition :name="nav?.transitionName.value">
      <component
        v-if="current_app"
        :is="current_app.component"
        :key="current_app.key"
        @close="emit('close')"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import AppLauncher from '@/phone/components/app-launcher.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { type PhoneApp } from '@/phone/system/types'
import { type AppSession } from '@/phone/system/runtime'
import { computed } from 'vue'
import { type TransitionPreset } from '@/phone/system/phone-navigator'

const { apps, transition, transitioning, active_session } = defineProps<{
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
    data-testid="phone"
    class="absolute top-0 right-0 pointer-events-auto w-60 h-89.5 bg-brown-300 dark:bg-grey-800
      drop-shadow-sm rounded-16 translate-y-7 group/phone"
  >
    <ui-button
      class="absolute! top-0 left-0 shadow-xs pointer-fine:opacity-0
        pointer-fine:group-hover/phone:opacity-100 opacity-100 transition-opacity duration-75 z-10"
      icon-left="close"
      icon-only
      theme="brown-100"
      @click="emit('close')"
    />

    <app-launcher v-if="!app" :apps="apps" :transitioning="transitioning" @close="emit('close')" />

    <div
      data-testid="app-viewport"
      class="rounded-[inherit] overflow-hidden absolute inset-0"
      :class="{ 'pointer-events-none': !app }"
    >
      <transition :name="transition">
        <div
          v-if="app?.component"
          data-testid="app-frame"
          class="rounded-[inherit] overflow-hidden h-full w-full"
        >
          <component
            :is="app.component"
            :display="app.display"
            @controller="controller"
            @close="emit('close')"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
/* App transitions */
.slide-left-enter-active,
.slide-right-enter-active,
.pop-up-enter-active,
.pop-down-enter-active,
.slide-left-leave-active,
.slide-right-leave-active,
.pop-up-leave-active,
.pop-down-leave-active {
  transition-property: transform, opacity;
  transition-timing-function: ease-in-out;
  transition-duration: var(--phone-duration);
}

.slide-left-leave-active,
.slide-right-leave-active,
.pop-up-leave-active,
.pop-down-leave-active {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-100%);
}

.pop-down-enter-from,
.pop-down-leave-to,
.pop-up-enter-from,
.pop-up-leave-to {
  transform: scale(50%);
  opacity: 0;
}
</style>

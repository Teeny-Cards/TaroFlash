<script setup lang="ts">
import { usePhoneNavigator } from '@/phone/system/phone-navigator'
import { onMounted, ref, provide, computed } from 'vue'
import { emitSfx } from '@/sfx/bus'
import { useShortcuts } from '@/composables/use-shortcuts'
import { installApps } from '@/phone/system/install-apps'
import { type PhoneApp, type PhoneContext } from '@/phone/system/types'
import { createPhoneRuntime } from '@/phone/system/runtime'
import phoneSm from '@/phone/components/phone-sm.vue'
import phoneBase from '@/phone/components/phone-base.vue'
import phoneLg from './components/phone-lg.vue'
import { useI18n } from 'vue-i18n'

const nav = usePhoneNavigator()
const shortcuts = useShortcuts('phone', { priority: 'background' })
const runtime = createPhoneRuntime({ nav })

const transitioning = ref(false)
const loading = ref(false)
const open = ref(false)
const ctx: PhoneContext = { ...runtime.phoneOS, t: useI18n().t }
let apps: PhoneApp[] = []

provide('phone-context', ctx)

shortcuts.register({
  combo: 'esc',
  handler: togglePhone
})

onMounted(async () => {
  loading.value = true
  apps = await installApps()
  runtime.init(apps, ctx)
  loading.value = false
})

const fullscreen = computed(() => {
  const { app } = runtime.active_session.value ?? {}

  if (app?.type === 'widget') return false
  return app?.display === 'full'
})

function togglePhone() {
  if (open.value) {
    closePhone()
  } else {
    openPhone()
  }
}

function openPhone() {
  if (loading.value) return

  open.value = true
  emitSfx('ui.pop_window')
}

function closePhone() {
  if (runtime.active_session.value) {
    runtime.phoneOS.close()
    emitSfx('ui.toggle_off')
    return
  }

  open.value = false
  emitSfx('ui.pop_window')
}
</script>

<template>
  <div
    data-testid="phone-stage"
    class="fixed inset-0 z-100 flex justify-center pointer-events-none"
  >
    <div
      data-testid="phone-dock"
      class="w-full max-w-(--page-width) flex items-center justify-center mx-4 sm:mx-10 relative"
    >
      <keep-alive>
        <transition name="phone-open">
          <phone-base
            v-if="open && !fullscreen"
            :apps="apps"
            :transition="nav.transition.value"
            :transitioning="transitioning"
            :active_session="runtime.active_session.value"
            @close="closePhone"
          ></phone-base>
        </transition>
      </keep-alive>

      <transition
        name="phone-close"
        @before-enter="transitioning = true"
        @after-leave="transitioning = false"
      >
        <phone-lg
          v-if="open && fullscreen"
          :active_session="runtime.active_session.value"
          @close="closePhone"
          class="z-10"
        ></phone-lg>

        <phone-sm v-else-if="!open" @open="openPhone"></phone-sm>
      </transition>

      <transition name="phone-backdrop">
        <div
          v-if="open && fullscreen"
          data-testid="phone-backdrop"
          class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7
            sm:backdrop-blur-4 sm:bg-black/10"
        ></div>
      </transition>
    </div>
  </div>
</template>

<style>
[data-testid='phone-stage'] {
  --duration: 100ms;
}

/* ANIMATIONS */
/* Base phone (pop + blur) */
.phone-open-enter-from,
.phone-open-leave-to {
  opacity: 0;
  filter: blur(var(--blur-md));
  transform: translateY(-40px);
}

.phone-open-enter-active,
.phone-open-leave-active {
  transition-property: transform, opacity, filter;
  transition-timing-function: ease-in-out;
  transition-duration: var(--duration);
}

/* Mini phone (slide) */
.phone-close-enter-from,
.phone-close-leave-to {
  opacity: 0;
  filter: blur(var(--blur-md));
  transform: translateY(40px);
}

.phone-close-enter-active,
.phone-close-leave-active {
  transition-property: transform, opacity, filter;
  transition-timing-function: ease-in-out;
  transition-duration: var(--duration);
}

/* Backdrop */
.phone-backdrop-enter-from,
.phone-backdrop-leave-to {
  opacity: 0;
}
.phone-backdrop-enter-active,
.phone-backdrop-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  transition-duration: var(--duration);
}

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
  transition-duration: var(--duration);
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

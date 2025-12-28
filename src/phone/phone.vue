<script setup lang="ts">
import { type PhoneNavigator, usePhoneNavigator } from '@/phone/system/phone-navigator'
import { onMounted, ref, provide, computed } from 'vue'
import { emitSfx } from '@/sfx/bus'
import { useShortcuts } from '@/composables/use-shortcuts'
import { installApps } from '@/phone/system/install-apps'
import { type PhoneApp, type PhoneContext, type PhoneRuntime } from '@/phone/system/types'
import { createPhoneRuntime } from '@/phone/system/runtime'
import phoneSm from '@/phone/components/phone-sm.vue'
import phoneBase from '@/phone/components/phone-base.vue'
import phoneLg from './components/phone-lg.vue'
import { useI18n } from 'vue-i18n'

const nav: PhoneNavigator = usePhoneNavigator()
const shortcuts = useShortcuts('phone', { priority: 'background' })

const open = ref(false)
const apps = ref<PhoneApp[]>([])
const runtime = ref<PhoneRuntime | undefined>(undefined)

const ctx: PhoneContext = { nav, t: useI18n().t }
provide('phone-context', ctx)

onMounted(async () => {
  apps.value = await installApps()
  runtime.value = createPhoneRuntime(apps.value, ctx)

  shortcuts.register([
    {
      id: 'toggle-phone',
      combo: 'esc',
      description: 'Toggle Phone',
      handler: togglePhone
    }
  ])
})

const fullscreen = computed(() => {
  return nav.top.value?.display === 'full'
})

function togglePhone() {
  if (open.value) {
    closePhone()
  } else {
    openPhone()
  }
}

function openPhone() {
  open.value = true
  emitSfx('ui.pop_window')
}

function closePhone() {
  if (nav.can_go_back.value) {
    nav.pop()
    emitSfx('ui.toggle_off')
    return
  }

  open.value = false
  nav.reset()
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
      <transition name="phone-open">
        <phone-base
          v-if="open && !fullscreen"
          :apps="apps"
          :runtime="runtime"
          @close="closePhone"
        ></phone-base>
      </transition>

      <transition name="phone-close">
        <phone-lg v-if="open && fullscreen" @close="closePhone"></phone-lg>
        <phone-sm v-else-if="!open" @open="openPhone"></phone-sm>
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

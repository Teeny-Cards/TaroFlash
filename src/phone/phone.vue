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
import { useMediaQuery } from '@/composables/use-media-query'
import { slideDownBlurIn, slideUpBlurOut, slideUpBlurIn, slideDownBlurOut } from '@/utils/animations/phone'

const nav = usePhoneNavigator()
const shortcuts = useShortcuts('phone', { priority: 'background' })
const runtime = createPhoneRuntime({ nav })
const is_pointer_coarse = useMediaQuery('coarse')

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
  return app?.type === 'view' && app.display === 'full'
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
  document.addEventListener('click', onPageClick)
}

function closePhone(force = false) {
  if (force && runtime.active_session.value) {
    runtime.phoneOS.clear()
    emitSfx('ui.toggle_off')
    return
  }

  if (runtime.active_session.value) {
    runtime.phoneOS.close()
    emitSfx('ui.toggle_off')
    return
  }

  open.value = false
  emitSfx('ui.pop_window')
  document.removeEventListener('click', onPageClick)
}

function onPageClick(e: Event) {
  if (!isInsidePhone(e)) {
    closePhone(true)
  }
}

function isInsidePhone(e: Event) {
  const path = (e.composedPath?.() ?? []) as EventTarget[]
  return path.some((n) => n instanceof HTMLElement && n.matches?.('[data-testid="phone"]'))
}

function onOpenBasePhone(el: Element, done: () => void) {
  const animation = is_pointer_coarse.value ? slideDownBlurIn : slideUpBlurIn
  animation(el, done)
}

function onCloseBasePhone(el: Element, done: () => void) {
  const animation = is_pointer_coarse.value ? slideUpBlurOut : slideDownBlurOut
  animation(el, done)
}

function onOpenLgPhone(el: Element, done: () => void) {
  slideUpBlurIn(el, done)
}

function onCloseLgPhone(el: Element, done: () => void) {
  slideDownBlurOut(el, done)
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
      <transition @enter="onOpenBasePhone" @leave="onCloseBasePhone">
        <phone-base
          v-if="open && !fullscreen"
          :apps="apps"
          :transition="nav.transition.value"
          :transitioning="transitioning"
          :active_session="runtime.active_session.value"
          class="z-10"
          @close="closePhone"
        ></phone-base>
      </transition>

      <transition
        @enter="onOpenLgPhone"
        @leave="onCloseLgPhone"
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
          class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7 backdrop-blur-4 sm:bg-black/10 -z-1"
        ></div>
      </transition>
    </div>
  </div>
</template>

<style>
[data-testid='phone-stage'] {
  --phone-duration: 100ms;
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
  transition-duration: var(--phone-duration);
}
</style>

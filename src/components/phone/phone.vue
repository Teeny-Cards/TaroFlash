<script setup lang="ts">
import Home from '@/components/phone/screens/home.vue'
import { useNavigationStack } from '@/composables/navigation-stack'
import { onMounted, ref, provide } from 'vue'
import { useAudio } from '@/composables/audio'
import { useShortcuts } from '@/composables/use-shortcuts'

const nav = useNavigationStack()
const { registerShortcut, trapFocus, releaseFocus } = useShortcuts('phone')

const open = ref(false)

provide('phone-nav', nav)

onMounted(() => {
  nav.resetTo(Home) // first show animates with defaultPreset

  registerShortcut([
    {
      id: 'open-phone',
      combo: 'esc',
      description: 'Open Phone',
      handler: openPhone,
      when: () => !open.value
    },
    {
      id: 'close-phone',
      combo: 'esc',
      description: 'Close Phone',
      handler: closePhone,
      when: () => open.value
    }
  ])
})

function openPhone() {
  trapFocus()
  open.value = true
  useAudio().play('pop_window')
}

function closePhone() {
  if (nav.can_go_back.value) {
    nav.pop()
    return
  }

  open.value = false
  releaseFocus()
  useAudio().play('pop_window')
  nav.resetTo(Home)
}
</script>

<template>
  <transition
    enter-from-class="opacity-0 blur-md -translate-y-10"
    enter-active-class="transition-[all] ease-in-out duration-100"
    leave-to-class="opacity-0 blur-md -translate-y-10"
    leave-active-class="transition-[all] ease-in-out duration-100"
  >
    <div v-if="open" data-testid="phone" class="pointer-events-auto h-min absolute top-4 right-0">
      <div class="w-60 h-89.5 bg-brown-300 shadow-cutout rounded-16 overflow-hidden relative">
        <transition :name="nav.transitionName.value">
          <component
            v-if="nav.top.value"
            :is="nav.top.value.component"
            v-bind="nav.top.value.props"
            :key="nav.top.value.key"
            @close="closePhone"
          />
        </transition>
      </div>
    </div>
  </transition>

  <transition
    enter-from-class="opacity-0 translate-y-10"
    enter-active-class="transition-[all] ease-in-out duration-100"
    leave-to-class="opacity-0 translate-y-10"
    leave-active-class="transition-[all] ease-in-out duration-100"
  >
    <div
      v-if="!open"
      @click="openPhone"
      data-testid="phone-minimized"
      class="w-16.25 h-22 bg-brown-300 rounded-4.5 shadow-button rotate-6 cursor-pointer p-2 pb-1 flex flex-col
        gap-1 items-center scale-75 pointer-events-auto"
    >
      <div
        data-testid="notification-badge"
        class="absolute top-0 left-0 w-4 h-4 bg-red-500 outline-4 outline-brown-300 rounded-full"
      ></div>
      <div class="w-full h-full bg-[#B8B1A9] rounded-2.5"></div>
      <div class="w-2.75 h-2.75 rounded-full outline-1 outline-[#B8B1A9] shrink-0"></div>
    </div>
  </transition>
</template>

<style>
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
  transition-duration: 0.1s;
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

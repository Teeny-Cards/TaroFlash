<script setup lang="ts">
import Home from '@/components/phone/screens/home.vue'
import { useNavigationStack } from '@/composables/navigation-stack'
import { onMounted, ref, provide } from 'vue'
import { useAudio } from '@/composables/audio'

const nav = useNavigationStack()
const open = ref(false)

provide('phone-nav', nav)

onMounted(() => {
  nav.resetTo(Home) // first show animates with defaultPreset
})

function openPhone() {
  open.value = true
  useAudio().play('pop_window')
}

function closePhone() {
  open.value = false
  useAudio().play('pop_window')
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
      <div
        class="w-60 h-89.5 bg-brown-300 shadow-popover rounded-16 overflow-hidden"
        @click="closePhone"
      >
        <transition :name="nav.transitionName.value" mode="out-in">
          <component
            v-if="nav.top.value"
            :is="nav.top.value.component"
            v-bind="nav.top.value.props"
            :key="nav.top.value.key"
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

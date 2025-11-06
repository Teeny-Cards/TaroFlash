<script setup lang="ts">
import Home from '@/components/phone/screens/home.vue'
import { useNavigationStack } from '@/composables/navigation-stack'
import { onMounted, ref } from 'vue'

const nav = useNavigationStack()

const open = ref(true)

onMounted(() => {
  nav.resetTo(Home) // first show animates with defaultPreset
})
</script>

<template>
  <div v-if="open" data-testid="phone-container" class="fixed bottom-8 right-8 z-1000">
    <div
      data-testid="phone"
      class="w-60 h-89.5 bg-brown-300 shadow-popover rounded-16 overflow-hidden"
    >
      <Transition :name="nav.transitionName.value" mode="out-in">
        <component
          v-if="nav.top.value"
          :is="nav.top.value.component"
          v-bind="nav.top.value.props"
          :key="nav.top.value.key"
        />
      </Transition>
    </div>
  </div>

  <div
    v-else
    @click="open = true"
    data-testid="phone-minimized"
    class="fixed bottom-6 right-6 w-16.25 h-22 bg-brown-300 rounded-4.5 shadow-button rotate-6 cursor-pointer
      p-2 pb-1 flex flex-col gap-1 items-center scale-75"
  >
    <div
      data-testid="notification-badge"
      class="absolute top-0 left-0 w-4 h-4 bg-red-500 outline-4 outline-brown-300 rounded-full"
    ></div>
    <div class="w-full h-full bg-[#B8B1A9] rounded-2.5"></div>
    <div class="w-2.75 h-2.75 rounded-full outline-1 outline-[#B8B1A9] shrink-0"></div>
  </div>
</template>

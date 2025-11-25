<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import phoneApp, { type App } from '../phone-app.vue'
import { useRouter } from 'vue-router'
import { type NavigationStack } from '@/composables/navigation-stack'
import { useModal } from '@/composables/modal'
import Inventory from '@/components/modals/inventory.vue'
import settings from '@/components/modals/settings/index.vue'
import Shortcuts from './shortcuts.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import { useAudio } from '@/composables/audio'
import { useSessionStore } from '@/stores/session'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const modal = useModal()
const { registerShortcut } = useShortcuts('phone/home')
const audio = useAudio()
const sessionStore = useSessionStore()

const phone_nav = inject<NavigationStack>('phone-nav')
const active_app = ref(-1)

onMounted(() => {
  registerShortcut([
    {
      id: 'left',
      combo: 'arrowleft',
      description: 'Select app to the left',
      handler: () => focusApp(active_app.value - 1)
    },
    {
      id: 'right',
      combo: 'arrowright',
      description: 'Select app to the right',
      handler: () => focusApp(active_app.value + 1)
    },
    {
      id: 'up',
      combo: 'arrowup',
      description: 'Select app above',
      handler: () => focusApp(active_app.value - 3)
    },
    {
      id: 'down',
      combo: 'arrowdown',
      description: 'Select app below',
      handler: () => focusApp(active_app.value + 3)
    },
    {
      id: 'open-app',
      combo: 'enter',
      description: 'Open selected app',
      handler: () => openApp()
    }
  ])
})

function run(fn: () => void) {
  fn()
  emit('close')
}

function focusApp(index: number) {
  if (index < 0) {
    active_app.value = apps.length - 1 // start from end
  } else if (active_app.value === -1) {
    active_app.value = 0 // start from beginning
  } else if (index >= apps.length) {
    active_app.value = 0 // wrap to beginning
  } else {
    active_app.value = index
  }

  const app = document.querySelectorAll('[data-testid="phone-app"]')[
    active_app.value
  ] as HTMLElement
  app?.focus()
  audio.play('pop_drip_mid')
}

function openApp() {
  apps[active_app.value].handler?.()
}

function openModal(component: any, args?: any) {
  modal.clearStack()
  modal.open(component, args)
  emit('close')
}

const apps: App[] = [
  {
    name: 'Settings',
    icon: 'settings',
    hover_icon: 'settings-hover',
    theme: 'pink',
    handler: () => openModal(settings, { backdrop: true })
  },
  {
    name: 'Inventory',
    icon: 'inventory',
    hover_icon: 'inventory-hover',
    theme: 'purple',
    handler: () => openModal(Inventory, { backdrop: true })
  },
  {
    name: 'Shortcuts',
    icon: 'shortcuts',
    hover_icon: 'shortcuts-hover',
    theme: 'orange',
    handler: () => phone_nav?.push(Shortcuts, { transition_preset: 'pop-up' })
  },
  {
    name: 'Logout',
    icon: 'logout',
    hover_icon: 'logout-hover',
    theme: 'red',
    handler: () => run(sessionStore.logout)
  }
]
</script>

<template>
  <div data-testid="home" class="h-full flex flex-col gap-8 px-5 py-7 pt-4">
    <div class="grid grid-cols-[18px_1fr_18px] px-6 justify-center items-center">
      <h2 class="text-brown-500 select-none col-start-2 justify-self-center">TaroPhone</h2>
      <button
        class="text-brown-500 border-[1.5px] border-brown-500 rounded-full p-0.5 w-min cursor-pointer"
      >
        <ui-icon src="edit" size="xs" />
      </button>
    </div>

    <div
      class="w-full grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-2 gap-y-6 sm:gap-y-2
        justify-center content-center"
    >
      <phone-app v-for="app in apps" :key="app.name" v-bind="app" />
    </div>
  </div>
</template>

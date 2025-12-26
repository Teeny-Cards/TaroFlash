<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import App from '@/phone/app.vue'
import { type PhoneApp, type PhoneActionContext } from '@/phone/system/types'
import { type PhoneNavigator } from '@/phone/system/phone-navigator'
import UiIcon from '@/components/ui-kit/icon.vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import { emitHoverSfx } from '@/sfx/bus'

const { apps, action_context } = defineProps<{
  apps: PhoneApp[]
  action_context: PhoneActionContext
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const shortcuts = useShortcuts('phone/home')

const phone_nav = inject<PhoneNavigator>('phone-nav')
const active_app = ref(-1)

onMounted(() => {
  shortcuts.register([
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
  emitHoverSfx('ui.pop_drip_mid')
}

function openApp(app?: PhoneApp) {
  const found = app ?? apps[active_app.value]
  if (!found) return

  if (found.kind === 'action') {
    found.action(action_context)
  } else {
    phone_nav?.push(found.component, { transition: 'pop-up' })
  }
}
</script>

<template>
  <div data-testid="home" class="h-full flex flex-col gap-8 px-5 py-7 pt-4">
    <div class="grid grid-cols-[18px_1fr_18px] px-6 justify-center items-center">
      <h2 class="text-brown-500 select-none col-start-2 justify-self-center">TaroPhone</h2>
      <button
        class="text-brown-500 border-[1.5px] border-brown-500 rounded-full p-0.5 w-min
          cursor-pointer"
      >
        <ui-icon src="edit" size="xs" />
      </button>
    </div>

    <div
      class="w-full grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-2 gap-y-6
        sm:gap-y-2 justify-center content-center"
    >
      <app v-for="app in apps" :key="app.id" :app="app" @click="openApp(app)" />
    </div>
  </div>
</template>

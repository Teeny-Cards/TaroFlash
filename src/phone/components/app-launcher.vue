<script setup lang="ts">
import { inject, onMounted, computed } from 'vue'
import App from '@/phone/components/app.vue'
import { type PhoneApp, type PhoneContext, type PhoneRuntime } from '@/phone/system/types'
import UiIcon from '@/components/ui-kit/icon.vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import { emitHoverSfx, emitSfx } from '@/sfx/bus'

const { apps, runtime } = defineProps<{
  apps: PhoneApp[]
  runtime?: PhoneRuntime
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const shortcuts = useShortcuts('phone/app-launcher')

const phone_context = inject<PhoneContext>('phone-context')!
const meta = phone_context.nav.meta
const active_app = computed(() => phone_context.nav.meta.active_app_index)

onMounted(() => {
  if (active_app.value !== -1) {
    focusApp(active_app.value, false)
  }

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

function focusApp(index: number, emit_hover_sfx = true) {
  if (index < 0) {
    meta.active_app_index = apps.length - 1 // start from end
  } else if (active_app.value === -1) {
    meta.active_app_index = 0 // start from beginning
  } else if (index >= apps.length) {
    meta.active_app_index = 0 // wrap to beginning
  } else {
    meta.active_app_index = index
  }

  const app = document.querySelectorAll('[data-testid="phone-app"]')[
    active_app.value
  ] as HTMLElement

  app?.focus()

  if (emit_hover_sfx) {
    emitHoverSfx('ui.pop_drip_mid')
  }
}

function openApp(app?: PhoneApp) {
  const found = app ?? apps[active_app.value]
  if (!found || !phone_context) return

  meta.active_app_index = apps.indexOf(found)

  if (found.kind === 'widget') {
    runtime?.getController(found.id)?.run?.()
  } else {
    phone_context.nav?.push(found, { transition: 'pop-up' })
    emitSfx('ui.toggle_on')
  }
}

// If the hovered app is not the active app,
// blur the active app and reset the active app index
function onHoverApp(app: PhoneApp) {
  const index = apps.indexOf(app)
  if (index === active_app.value) return

  const found = document.querySelectorAll('[data-testid="phone-app"]')[
    active_app.value
  ] as HTMLElement

  meta.active_app_index = -1
  found?.blur()
}
</script>

<template>
  <div data-testid="app-launcher" class="h-full flex flex-col gap-8 px-5 py-7 pt-4">
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
      <app
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @click="openApp(app)"
        @mouseenter="onHoverApp(app)"
      />
    </div>
  </div>
</template>

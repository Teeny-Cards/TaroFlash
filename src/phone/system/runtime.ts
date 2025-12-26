// runtime.ts
import { ref, computed } from 'vue'
import type { PhoneApp } from './types'

export function createPhoneRuntime(apps: PhoneApp[]) {
  const mountedById = ref<Record<string, boolean>>({})

  for (const app of apps) {
    if (app.kind === 'view' && (app.mount_policy ?? 'never') === 'startup') {
      mountedById.value[app.id] = true
    }
  }

  const mountedApps = computed(() =>
    apps.filter((a) => a.kind === 'view' && mountedById.value[a.id])
  )

  function mount(id: string) {
    mountedById.value[id] = true
  }

  function unmount(id: string) {
    delete mountedById.value[id]
  }

  return { apps, mount, unmount, mountedApps }
}

import { markRaw } from 'vue'
import type { PhoneApp } from './types'
import installed from '@/phone/apps/installed'

export function defineApp(app: PhoneApp) {
  return app
}

export async function installApps() {
  const apps = await _getInstalledApps()

  const ids = new Set<string>()
  for (const app of apps) {
    // Validate unique ids
    if (ids.has(app.id)) throw new Error(`Duplicate phone app id: ${app.id}`)
    ids.add(app.id)

    if (app.kind === 'view') {
      app.component = markRaw(app.component)
    }
  }

  return apps
}

function _getInstalledApps(): Promise<PhoneApp[]> {
  const filtered = Object.entries(installed).filter(([_key, value]) => value === true)
  const imported = filtered.map(([key, _value]) =>
    import(`@/phone/apps/${key}/_manifest.ts`).then((m) => m.default)
  )

  return Promise.all(imported)
}

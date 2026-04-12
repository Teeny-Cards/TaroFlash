import { markRaw } from 'vue'
import type { PhoneApp } from './types'
import user_apps from '@/phone/apps/installed'
import uid from '@/utils/uid'

export async function installApps() {
  const apps = await _getInstalledApps()

  const titles = new Set<string>()
  for (const app of apps) {
    if (titles.has(app.title)) throw new Error(`Duplicate phone app title: ${app.title}`)
    titles.add(app.title)

    app.id = uid()

    if (app.type === 'view') {
      app.component = markRaw(app.component)
    }
  }

  return apps
}

function _getInstalledApps(): Promise<PhoneApp[]> {
  const filtered = Object.entries(user_apps).filter(([_title, installed]) => installed === true)
  const imported = filtered.map(([title]) =>
    import(`@/phone/apps/${title}/_manifest.ts`).then((m) => m.default)
  )

  return Promise.all(imported)
}

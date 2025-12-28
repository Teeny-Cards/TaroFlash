import { defineApp } from '@/phone/system/install-apps'
import settings from './component/index.vue'

export default defineApp({
  id: 'settings',
  title: 'Settings',
  kind: 'view',
  mount_policy: 'on-open',
  display: 'full',
  component: settings,
  launcher: {
    icon_src: 'settings',
    hover_icon_src: 'settings-hover',
    theme: 'pink'
  }
})

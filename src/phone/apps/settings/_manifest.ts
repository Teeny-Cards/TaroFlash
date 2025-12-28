import { defineApp } from '@/phone/system/install-apps'
import component from './component/index.vue'

export default defineApp({
  id: 'settings',
  title: 'Settings',
  kind: 'view',
  mount_policy: 'on-open',
  display: 'full',
  component,
  launcher: {
    icon_src: 'settings',
    hover_icon_src: 'settings-hover',
    theme: 'pink'
  }
})

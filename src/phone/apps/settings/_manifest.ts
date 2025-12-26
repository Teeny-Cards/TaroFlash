import { defineApp } from '@/phone/system/install-apps'

export default defineApp({
  id: 'settings',
  title: 'Settings',
  kind: 'action',
  mount_policy: 'startup',
  display: 'full',
  action: () => {
    console.log('action')
  },
  launcher: {
    icon_src: 'settings',
    hover_icon_src: 'settings-hover',
    theme: 'pink'
  }
})

import { defineApp } from '@/phone/system/install-apps'

export default defineApp({
  id: 'logout',
  title: 'Logout',
  kind: 'action',
  mount_policy: 'startup',
  action: ({ services }) => {
    services.auth.logout()
  },
  launcher: {
    icon_src: 'logout',
    hover_icon_src: 'logout-hover',
    theme: 'red'
  }
})

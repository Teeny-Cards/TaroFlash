import { defineApp } from '@/phone/system/install-apps'

export default defineApp({
  id: 'inventory',
  title: 'Inventory',
  kind: 'action',
  mount_policy: 'startup',
  display: 'full',
  action: () => {
    console.log('action')
  },
  launcher: {
    icon_src: 'inventory',
    hover_icon_src: 'inventory-hover',
    theme: 'purple'
  }
})

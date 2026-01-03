import { defineApp } from '@/phone/system/install-apps'

export default defineApp({
  title: 'Inventory',
  type: 'widget',
  launcher: {
    icon_src: 'inventory',
    hover_icon_src: 'inventory-hover',
    theme: 'purple'
  }
})

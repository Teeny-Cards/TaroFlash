import { defineApp } from '@/phone/system/install-apps'
import component from './component/index.vue'

export default defineApp({
  title: 'Settings',
  type: 'view',
  display: 'full',
  component,
  launcher: {
    icon_src: 'settings',
    hover_icon_src: 'settings-hover',
    theme: 'pink-400'
  }
})

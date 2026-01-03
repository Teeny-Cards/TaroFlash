import { defineApp } from '@/phone/system/install-apps'
import component from './component.vue'

export default defineApp({
  title: 'Shortcuts',
  type: 'view',
  display: 'panel',
  component,
  launcher: {
    icon_src: 'shortcuts',
    hover_icon_src: 'shortcuts-hover',
    theme: 'orange'
  }
})

import { defineApp } from '@/phone/system/install-apps'
import shortcuts from './shortcuts.vue'

export default defineApp({
  id: 'shortcuts',
  title: 'Shortcuts',
  kind: 'view',
  mount_policy: 'on-open',
  display: 'panel',
  component: shortcuts,
  launcher: {
    icon_src: 'shortcuts',
    hover_icon_src: 'shortcuts-hover',
    theme: 'orange'
  }
})

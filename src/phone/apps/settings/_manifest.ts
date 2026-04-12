import type { ViewApp } from '@/phone/system/types'
import component from './component/index.vue'

export default {
  title: 'Settings',
  type: 'view',
  display: 'full',
  component,
  launcher: {
    icon_src: 'settings',
    hover_icon_src: 'settings-hover',
    theme: 'pink-400'
  }
} satisfies Omit<ViewApp, 'id'>

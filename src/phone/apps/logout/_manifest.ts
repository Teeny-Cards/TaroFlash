import type { TriggerApp } from '@/phone/system/types'
import { createLogoutController } from './controller'

export default {
  title: 'Logout',
  type: 'trigger',
  controller: createLogoutController,
  launcher: {
    icon_src: 'logout',
    hover_icon_src: 'logout-hover',
    theme: 'red-400'
  }
} satisfies Omit<TriggerApp, 'id'>

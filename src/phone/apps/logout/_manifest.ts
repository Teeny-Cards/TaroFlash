import { defineApp } from '@/phone/system/install-apps'
import { createLogoutController } from './controller'

export default defineApp({
  title: 'Logout',
  type: 'trigger',
  controller: createLogoutController,
  launcher: {
    icon_src: 'logout',
    hover_icon_src: 'logout-hover',
    theme: 'red-400'
  }
})

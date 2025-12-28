import { defineApp } from '@/phone/system/install-apps'
import { createLogoutController } from './controller'

export default defineApp({
  id: 'logout',
  title: 'Logout',
  kind: 'widget',
  mount_policy: 'on-open',
  controller: createLogoutController,
  launcher: {
    icon_src: 'logout',
    hover_icon_src: 'logout-hover',
    theme: 'red'
  }
})

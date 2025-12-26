import type { Component } from 'vue'
import type { PhoneNavigator } from './phone-navigator'
import { getServices } from './services'

export type PhoneAppId = string
export type PhoneAppDisplay = 'full' | 'panel'
export type AppMountPolicy = 'startup' | 'on-open'
export type PhoneAppKind = 'view' | 'action'

export type PhoneActionContext = {
  nav: PhoneNavigator
  services: ReturnType<typeof getServices>
}

type LauncherConfig = {
  icon_src: string
  hover_icon_src?: string
  theme: MemberTheme
}

type BaseApp = {
  id: PhoneAppId
  title: string
  launcher: LauncherConfig
  mount_policy: AppMountPolicy
  order?: number
  badge?: () => number | null
}

export type ViewApp = BaseApp & {
  kind: 'view'
  display: PhoneAppDisplay
  component: Component
  onOpen?: (params?: any) => void
  onClose?: () => void
}

export type ActionApp = BaseApp & {
  kind: 'action'
  action: (ctx: PhoneActionContext) => void | Promise<void>
}

export type PhoneApp = ViewApp | ActionApp

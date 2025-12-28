import type { Component } from 'vue'
import type { PhoneNavigator } from './phone-navigator'
import { createPhoneRuntime } from './runtime'
import { useI18n } from 'vue-i18n'

export type PhoneAppId = string
export type PhoneAppDisplay = 'full' | 'panel'
export type AppMountPolicy = 'startup' | 'on-open'
export type PhoneAppKind = 'view' | 'widget'

export type PhoneContext = {
  nav: PhoneNavigator
  t: ReturnType<typeof useI18n>['t']
}

type LauncherConfig = {
  icon_src: string
  hover_icon_src?: string
  theme: MemberTheme
}

type BaseApp<TController extends AppController = AppController> = {
  id: PhoneAppId
  title: string
  launcher: LauncherConfig
  mount_policy: AppMountPolicy
  order?: number
  controller?: (ctx: PhoneContext) => TController
}

export type ViewApp = BaseApp & {
  kind: 'view'
  display: PhoneAppDisplay
  component: Component
  onOpen?: (params?: any) => void
  onClose?: () => void
}

export type WidgetApp = BaseApp & {
  kind: 'widget'
}

export type AppController = {
  run?: () => void | Promise<void>
  stop?: () => void | Promise<void>
}

export type PhoneApp = ViewApp | WidgetApp

export type PhoneRuntime = ReturnType<typeof createPhoneRuntime>

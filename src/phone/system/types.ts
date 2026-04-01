import type { Component } from 'vue'
import { createPhoneRuntime } from './runtime'
import { useI18n } from 'vue-i18n'

export type PhoneAppDisplay = 'full' | 'panel'
export type MountPolicy = 'immediate' | 'lazy'

export type PhoneContext = PhoneOS & {
  t: ReturnType<typeof useI18n>['t']
}

type LauncherConfig = {
  icon_src: string
  hover_icon_src?: string
  theme: MemberTheme
}

type BaseApp<TController extends AppController = AppController> = {
  id: string
  title: string
  mount_policy?: MountPolicy
  controller?: (ctx: PhoneContext) => TController
}

export type ViewApp = BaseApp & {
  type: 'view'
  display: PhoneAppDisplay
  launcher: LauncherConfig
  component: Component
}

export type WidgetApp = BaseApp & {
  type: 'widget'
  component?: Component
}

export type TriggerApp = BaseApp & {
  type: 'trigger'
  launcher: LauncherConfig
}

export type AppController = {
  setup?: () => void | Promise<void>
  destroy?: () => void | Promise<void>
  run?: () => void | Promise<void>
}

export type PhoneApp = ViewApp | WidgetApp | TriggerApp
export type Manifest = Omit<ViewApp, 'id'> | Omit<WidgetApp, 'id'> | Omit<TriggerApp, 'id'>
export type PhoneRuntime = ReturnType<typeof createPhoneRuntime>
export type PhoneOS = PhoneRuntime['phoneOS']

export type AppProps = {
  display: PhoneAppDisplay
}

export type AppEmits = {
  (e: 'close'): void
}

import type { Component, InjectionKey } from 'vue'
import { createPhoneRuntime } from './runtime'
import { useI18n } from 'vue-i18n'

export type TransitionPreset = 'slide-left' | 'slide-right' | 'pop-up' | 'pop-down' | 'none'
export type PhoneAppDisplay = 'full' | 'panel'
export type MountPolicy = 'immediate' | 'lazy'

export type PhoneContext = PhoneOS & {
  t: ReturnType<typeof useI18n>['t']
}

export type NotifyPayload = {
  count?: number
}

export type PhoneNotification = NotifyPayload & {
  app_id: string
}

export type AppContext = PhoneContext & {
  notify: (payload: NotifyPayload) => void
  clearNotification: () => void
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
  controller?: (ctx: AppContext) => TController
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
  run?: () => void | Promise<void>
}

export type PhoneApp = ViewApp | WidgetApp | TriggerApp
export type PhoneRuntime = ReturnType<typeof createPhoneRuntime>
export type PhoneOS = PhoneRuntime['phoneOS']

export const APP_CTX_KEY: InjectionKey<{ controller: AppController | undefined }> =
  Symbol('app-ctx')

export type AppProps = {
  close: () => void
}

export type AppEmits = {
  (e: 'close'): void
}

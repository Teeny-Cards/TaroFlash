import type { Component } from 'vue'
import type { PhoneNavigator } from './phone-navigator'
import { createPhoneRuntime } from './runtime'
import { useI18n } from 'vue-i18n'

export type PhoneAppDisplay = 'full' | 'panel'

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
  id: string
  title: string
  launcher: LauncherConfig
  controller?: (ctx: PhoneContext) => TController
}

export type ViewApp = BaseApp & {
  type: 'view'
  display: PhoneAppDisplay
  component: Component
}

export type WidgetApp = BaseApp & {
  type: 'widget'
}

export type AppController = {
  setup?: () => void | Promise<void>
  destroy?: () => void | Promise<void>
  run?: () => void | Promise<void>
}

export type PhoneApp = ViewApp | WidgetApp
export type Manifest = Omit<ViewApp, 'id'> | Omit<WidgetApp, 'id'>
export type PhoneRuntime = ReturnType<typeof createPhoneRuntime>

import type { WidgetApp } from '@/phone/system/types'
import component from './component.vue'

export default {
  title: 'Darkmode',
  type: 'widget',
  component
} satisfies Omit<WidgetApp, 'id'>

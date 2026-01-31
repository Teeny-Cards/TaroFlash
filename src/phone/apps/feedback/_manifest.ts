import { defineApp } from '@/phone/system/install-apps'

export default defineApp({
  title: 'Feedback',
  type: 'trigger',
  launcher: {
    icon_src: 'feedback',
    hover_icon_src: 'feedback-hover',
    theme: 'green-400'
  }
})

import './tailwind.postcss'

import DefaultTheme from 'vitepress/theme'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { vSfx } from '@/sfx/directive'
import messages from '@intlify/unplugin-vue-i18n/messages'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    const i18n = createI18n({
      locale: 'en-us',
      legacy: false,
      escapeParameter: false,
      messages
    })

    app.use(createPinia())
    app.use(i18n)
    app.directive('sfx', vSfx)
  }
}

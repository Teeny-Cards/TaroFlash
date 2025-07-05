// test/setup.ts
import { config } from '@vue/test-utils'
import registerUIKitComponents from '@/components/ui-kit/_index'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  messages
})

const app = createApp({})
app.use(i18n)
registerUIKitComponents(app)

// Copy the globally registered components into test-utils config
config.global.components = app._context.components
config.global.plugins = [i18n]

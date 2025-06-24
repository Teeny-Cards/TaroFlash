import './styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import enUS from './translations/en-us'
import Logger from './utils/logger'
import registerUIKitComponents from './components/ui-kit/_index'

Logger.setLogLevel(import.meta.env.VITE_LOG_LEVEL)

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  messages: {
    'en-us': enUS
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

registerUIKitComponents(app)

app.mount('#app')

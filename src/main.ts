import './styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { vSfx } from '@/sfx/directive'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
  caches?.keys?.().then((keys) => keys.forEach((k) => caches.delete(k)))
}

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  escapeParameter: false,
  messages
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.directive('sfx', vSfx)

app.mount('#app')

import './styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import audio_player from '@/sfx/player'
import { vSfx } from '@/sfx/directive'
import { useSessionStore } from './stores/session'

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

const session = useSessionStore()

session.startLoading()
await audio_player.setup()
session.stopLoading()

app.mount('#app')

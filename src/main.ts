import './styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { useAudio } from './composables/audio'

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  escapeParameter: false,
  messages
})

const app = createApp(App)

const audio = useAudio()
audio.preload()

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')

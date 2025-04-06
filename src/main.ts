import './assets/styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Logger from './utils/logger'

Logger.setLogLevel(import.meta.env.VITE_LOG_LEVEL)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
Logger.info('Application mounted')

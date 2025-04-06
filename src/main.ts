import './assets/styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Logger from './utils/logger'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$logger = Logger

app.mount('#app')

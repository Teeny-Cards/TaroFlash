import './styles/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Logger from './utils/logger'
import registerUIKitComponents from './components/ui-kit/_index'

Logger.setLogLevel(import.meta.env.VITE_LOG_LEVEL)

const app = createApp(App)

app.use(createPinia())
app.use(router)

registerUIKitComponents(app)

app.mount('#app')

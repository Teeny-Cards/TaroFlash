import './assets/main.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAppStore } from './stores/app'
import { useUserStore } from './stores/user'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { handleUserAuthStateChange } from './services/userService'

const firebaseConfig = {
  apiKey: 'AIzaSyDCXN86DZJ1VOLuRSPPUw4ClbF8uqQ908E',
  authDomain: 'tinycards-9b4f2.firebaseapp.com',
  projectId: 'tinycards-9b4f2',
  storageBucket: 'tinycards-9b4f2.appspot.com',
  messagingSenderId: '1067245046547',
  appId: '1:1067245046547:web:e60bfc87982cd49bc2e8e6',
  measurementId: 'G-BC90DCFVZR'
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, async (user) => {
  const userStore = useUserStore()
  await userStore.login(user)

  if (userStore.authenticated) {
    const app = useAppStore()
    app.setLoading(false)
  } else {
    router.push({ name: 'signin' })
  }
})

app.mount('#app')

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDCXN86DZJ1VOLuRSPPUw4ClbF8uqQ908E',
  authDomain: 'tinycards-9b4f2.firebaseapp.com',
  projectId: 'tinycards-9b4f2',
  storageBucket: 'tinycards-9b4f2.appspot.com',
  messagingSenderId: '1067245046547',
  appId: '1:1067245046547:web:e60bfc87982cd49bc2e8e6',
  measurementId: 'G-BC90DCFVZR'
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)
const auth = getAuth(firebase)

onAuthStateChanged(auth, (user) => {
  const authStore = useAuthStore()

  if (user) {
    authStore.setUser(authStore)
    authStore.setAuthenticated()
    router.push({ name: 'home' })
  } else {
    authStore.setUser(null)
    authStore.setNotAuthenticated()
    router.push({ name: 'login' })
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

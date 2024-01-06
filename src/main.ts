import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

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
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid
    // ...
  } else {
    // User is signed out
    // ...
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../views/Dashboard.vue'
import CreateView from '../views/CreateView.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignupPage.vue'
import HomeView from '../views/HomeView.vue'
import DeckView from '../views/DeckView.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashBoard
        },
        {
          path: 'create',
          name: 'create',
          component: CreateView
        },
        {
          path: 'deck/:id',
          name: 'deck',
          component: DeckView,
          props: true
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useUserStore()

  if (to.name !== 'signin' && to.name !== 'signup' && !authStore.authenticated) {
    return { name: 'signin' }
  }

  return true
})

export default router

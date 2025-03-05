import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../views/Dashboard.vue'
import CreateView from '../views/CreateView.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignupPage.vue'
import HomeView from '../views/HomeView.vue'
import DeckView from '../views/deck/index.vue'
import LoadingVue from '../views/LoadingView.vue'
import { useUserStore } from '../stores/member'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { requiresAuth: false },
      redirect: { name: 'loading' },
      children: [
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
          path: '/app',
          name: 'loading',
          component: LoadingVue,
          props: true
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      redirect: { name: 'dashboard' },
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashBoard
        },
        {
          path: '/create',
          name: 'create',
          component: CreateView
        },
        {
          path: '/deck/:id',
          name: 'deck',
          component: DeckView,
          props: true
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const { authenticated } = storeToRefs(useUserStore())
  const { loading } = storeToRefs(useAppStore())
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (!requiresAuth) {
    return true
  } else if (requiresAuth && loading.value) {
    return { name: 'loading', query: { path: to.fullPath } }
  } else if (requiresAuth && authenticated.value) {
    return true
  } else {
    return { name: 'signin' }
  }
})

export default router

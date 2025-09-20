import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/dashboard.vue'
import ShopView from '@/views/shop.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import AppView from '@/views/app.vue'
import DeckView from '@/views/deck.vue'
import { initUser } from '@/stores/initUser'

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
      name: 'authenticated',
      component: AppView,
      redirect: '/dashboard',
      beforeEnter: async () => {
        const authenticated = await initUser()
        if (!authenticated) return { name: 'signin' }
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'shop',
          name: 'shop',
          component: ShopView
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

export default router

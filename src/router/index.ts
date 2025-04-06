import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '@/views/Dashboard.vue'
import ShopView from '@/views/shop/index.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import AppView from '@/views/AppView.vue'
import DeckView from '@/views/deck/index.vue'
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
      beforeEnter: async () => {
        const authenticated = await initUser()
        if (!authenticated) return { name: 'signin' }
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashBoard
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

import { createRouter, createWebHistory } from 'vue-router'
import { initUser } from '@/stores/initUser'
import Dashboard from '@/views/dashboard.vue'
import ShopView from '@/views/shop.vue'
import WelcomeView from '@/views/welcome.vue'
import DeckView from '@/views/deck.vue'
import AuthenticatedView from '@/views/authenticated.vue'
import CheckoutView from '@/views/checkout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/',
      name: 'authenticated',
      component: AuthenticatedView,
      redirect: '/dashboard',
      beforeEnter: async () => {
        const authenticated = await initUser()
        if (!authenticated) return { name: 'welcome' }
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
        },
        {
          path: '/checkout',
          name: 'checkout',
          component: CheckoutView
        }
      ]
    }
  ]
})

export default router

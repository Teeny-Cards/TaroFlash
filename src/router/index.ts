import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import Dashboard from '@/views/dashboard.vue'
import ShopView from '@/views/shop/shop-view.vue'
import WelcomeView from '@/views/welcome/welcome-view.vue'
import DeckView from '@/views/deck/deck-view.vue'
import AuthenticatedView from '@/views/authenticated.vue'
import PrivacyPolicyView from '@/views/privacy-policy.vue'
import TermsOfServiceView from '@/views/terms-of-service.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/privacy',
      name: 'privacy-policy',
      component: PrivacyPolicyView
    },
    {
      path: '/terms',
      name: 'terms-of-service',
      component: TermsOfServiceView
    },
    {
      path: '/',
      name: 'authenticated',
      component: AuthenticatedView,
      redirect: '/dashboard',
      beforeEnter: async () => {
        const session = useSessionStore()
        await session.setup()

        if (!session.authenticated) return { name: 'welcome' }
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

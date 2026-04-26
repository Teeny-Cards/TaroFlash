import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { prefetchMemberDecks } from '@/api/decks'
import { prefetchMemberById } from '@/api/members'
import WelcomeView from '@/views/welcome/welcome-view.vue'
import AuthenticatedView from '@/views/authenticated.vue'
import PrivacyPolicyView from '@/views/privacy-policy.vue'
import TermsOfServiceView from '@/views/terms-of-service.vue'
import AuthCallbackView from '@/views/auth/callback.vue'

const Dashboard = () => import('@/views/dashboard/index.vue')
const DeckView = () => import('@/views/deck/index.vue')

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
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView
    },
    {
      path: '/',
      name: 'authenticated',
      component: AuthenticatedView,
      redirect: '/dashboard',
      beforeEnter: async () => {
        const session = useSessionStore()
        const authenticated = await session.restoreSession()

        if (!authenticated) return { name: 'welcome' }

        // Fire member + decks in parallel with the lazy route chunk fetch
        // so the dashboard / deck view renders against warm cache.
        prefetchMemberDecks()
        const id = session.user?.id
        if (id) prefetchMemberById(id)
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
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

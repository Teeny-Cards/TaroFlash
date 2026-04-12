import { defineConfig } from 'vitepress'
import svgLoader from 'vite-svg-loader'

const devSidebar = [
  {
    text: 'UI Kit',
    collapsed: true,
    items: [
      { text: 'Button', link: '/components/button' },
      { text: 'Button Menu', link: '/components/button-menu' },
      { text: 'Card', link: '/components/card' },
      { text: 'Icon', link: '/components/icon' },
      { text: 'Modal', link: '/components/modal' }
    ]
  },
  {
    text: 'Modal System',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/modal/index' },
      { text: 'Modes & Backdrop', link: '/modal/modes' },
      { text: 'Response & Close', link: '/modal/response' },
      { text: 'Stacking', link: '/modal/stacking' },
      { text: 'Intercepting Close', link: '/modal/request-close' },
      { text: 'Context Injection', link: '/modal/context' },
      { text: 'API Reference', link: '/modal/reference' }
    ]
  },
  {
    text: 'TaroPhone',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/phone/index' },
      { text: 'App Types', link: '/phone/app-types' },
      { text: 'Controllers', link: '/phone/controllers' },
      { text: 'Notifications', link: '/phone/notifications' },
      { text: 'Context & Injection', link: '/phone/context' },
      { text: 'API Reference', link: '/phone/reference' }
    ]
  }
]

export default defineConfig({
  srcDir: 'src',
  title: 'TaroFlash Docs',
  description: 'Documentation for TaroFlash',
  themeConfig: {
    nav: [
      { text: 'Developer Docs', link: '/components/button' },
      { text: 'Design System', link: '/design-system/index' }
    ],

    sidebar: {
      '/components/': devSidebar,
      '/modal/': devSidebar,
      '/phone/': devSidebar,
      '/design-system/': [
        {
          text: 'Design System',
          items: [{ text: 'Overview', link: '/design-system/index' }]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Teeny-Cards/TaroFlash' }]
  },
  vite: {
    plugins: [svgLoader()],
    resolve: {
      alias: {
        '@': '../../../src',
        '@base': '../../..'
      }
    }
  }
})

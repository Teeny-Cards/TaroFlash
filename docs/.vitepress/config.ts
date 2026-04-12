import { defineConfig } from 'vitepress'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  srcDir: 'src',
  title: 'Teeny Docs',
  description: 'Documentation for TeenyCards',
  themeConfig: {
    nav: [
      { text: 'Components', link: '/components/ui-kit-button' },
      { text: 'Design System', link: '/design-system/index' },
      { text: 'TaroPhone', link: '/phone/index' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Home', link: '/' },
            { text: 'Design System', link: '/design-system/index' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Teeny Button', link: '/components/ui-kit-button' },
            { text: 'Teeny Button Menu', link: '/components/teeny-button-menu' },
            { text: 'Teeny Card', link: '/components/teeny-card' },
            { text: 'Teeny Icon', link: '/components/teeny-icon' }
          ]
        },
        {
          text: 'TaroPhone',
          items: [
            { text: 'Overview', link: '/phone/index' },
            { text: 'App Types', link: '/phone/app-types' },
            { text: 'Controllers', link: '/phone/controllers' },
            { text: 'Notifications', link: '/phone/notifications' },
            { text: 'Context & Injection', link: '/phone/context' },
            { text: 'API Reference', link: '/phone/reference' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Teeny Button', link: '/components/ui-kit-button' },
            { text: 'Teeny Button Menu', link: '/components/teeny-button-menu' },
            { text: 'Teeny Card', link: '/components/teeny-card' },
            { text: 'Teeny Icon', link: '/components/teeny-icon' }
          ]
        }
      ],
      '/design-system/': [
        {
          text: 'Design System',
          items: [{ text: 'Overview', link: '/design-system/index' }]
        }
      ],
      '/phone/': [
        {
          text: 'TaroPhone',
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
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/ChrisJol/TeenyCards' }]
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

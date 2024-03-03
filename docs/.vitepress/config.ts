import { defineConfig } from 'vitepress'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  srcDir: 'src',
  title: 'Teeny Docs',
  description: 'Documentation for TeenyCards',
  themeConfig: {
    nav: [
      { text: 'Components', link: '/components/teeny-button' },
      { text: 'Design System', link: '/design-system/index' }
    ],

    sidebar: {
      '/components/': [
        {
          text: 'Components',
          items: [{ text: 'Teeny Button', link: '/components/teeny-button' }]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/ChrisJol/TeenyCards' }]
  },
  vite: {
    plugins: [svgLoader()],
    resolve: {
      alias: {
        '@teeny': '../../../src/components/TeenyComponents',
        '@app': '../../..'
      }
    }
  }
})

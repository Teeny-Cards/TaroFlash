import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import svgLoader from 'vite-svg-loader'
import dataUriPlugin from './src/plugins/vite-datauri'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { defineConfig, coverageConfigDefaults } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  fmt: {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'none',
    sortPackageJson: false,
    ignorePatterns: []
  },
  lint: {
    ignorePatterns: ['dist/**', 'supabase/**'],
    options: {
      typeAware: true,
      typeCheck: false
    },
    rules: {
      'no-console': 'warn',
      'no-floating-promises': 'off'
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    dataUriPlugin(),
    tailwindcss(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      strictMessage: false
    })
  ],
  test: {
    setupFiles: ['./tests/setup.js'],
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'Unit', color: 'blue' },
          include: ['tests/unit/**/*.test.js'],
          environment: 'jsdom'
        }
      },
      {
        extends: true,
        test: {
          name: { label: 'Integration', color: 'green' },
          include: ['tests/integration/**/*.test.js'],
          environment: 'jsdom'
        }
      }
    ],
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,vue}'],
      reporter: ['text', 'html', 'json-summary'],
      reportOnFailure: true,
      exclude: [
        '**/postcss.config.js',
        '**/App.vue',
        '**/main.ts',
        '**/supabase-client.ts',
        '**/router/**',
        '**/src/api/**',
        '**/src/components/ui-kit/_index.ts',
        '**/types/**',
        '**/src/utils/logger.ts',
        '**/src/utils/uid.ts',
        ...coverageConfigDefaults.exclude
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@type': fileURLToPath(new URL('./types', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url))
    }
  }
})

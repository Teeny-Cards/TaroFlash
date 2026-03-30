import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import svgLoader from 'vite-svg-loader'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { defineConfig, configDefaults, coverageConfigDefaults } from 'vite-plus'
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
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true
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
    tailwindcss(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      strictMessage: false
    })
  ],
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    setupFiles: ['./tests/setup.js'],
    coverage: {
      enabled: true,
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

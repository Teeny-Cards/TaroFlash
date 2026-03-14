import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import svgLoader from 'vite-svg-loader'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { defineConfig } from 'vite-plus'
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
    ignorePatterns: [],
    sortTailwindcss: {
      stylesheet: resolve(dirname(fileURLToPath(import.meta.url)), './src/styles/main.css'),
      attributes: [':class'],
      preserveWhitespace: true
    }
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@type': fileURLToPath(new URL('./types', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url))
    }
  }
})

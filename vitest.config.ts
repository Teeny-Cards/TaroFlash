import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults, coverageConfigDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/tests/setup.js'],
      coverage: {
        enabled: true,
        reporter: ['text', 'json', 'html'],
        exclude: [
          '**/postcss.config.js',
          '**/App.vue',
          '**/main.ts',
          '**/supabaseClient.ts',
          '**/router/**',
          '**/src/services/**',
          '**/src/components/ui-kit/_index.ts',
          ...coverageConfigDefaults.exclude
        ]
      }
    }
  })
)

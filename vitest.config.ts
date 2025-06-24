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
      setupFiles: ['./tests/setup.js'],
      coverage: {
        enabled: true,
        reporter: ['text', 'json', 'html', 'json-summary'],
        reportOnFailure: true,
        thresholds: {
          lines: 90
        },
        exclude: [
          '**/postcss.config.js',
          '**/App.vue',
          '**/main.ts',
          '**/supabaseClient.ts',
          '**/router/**',
          '**/src/services/**',
          '**/src/components/ui-kit/_index.ts',
          '**/types/**',
          '**/src/utils/logger.ts',
          '**/src/utils/uid.ts',
          ...coverageConfigDefaults.exclude
        ]
      }
    }
  })
)

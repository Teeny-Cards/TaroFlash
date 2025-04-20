import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import svgLoader from 'vite-svg-loader'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const UIKitResolver = () => (name: string) => {
  if (!name.startsWith('UIKit:')) return

  const componentName = name.split(':')[1]
  return {
    name: componentName,
    from: path.resolve(__dirname, 'src/components/UIKit', `${componentName}.vue`)
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

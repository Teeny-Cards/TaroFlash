// test/setup.ts
import { config } from '@vue/test-utils'
import registerUIKitComponents from '@/components/ui-kit/_index'

import { createApp } from 'vue'

// Fake app just to register globally
const app = createApp({})
registerUIKitComponents(app)

// Copy the globally registered components into test-utils config
config.global.components = app._context.components

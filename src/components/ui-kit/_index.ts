import { type App, type Component } from 'vue'

export default function registerUIKitComponents(app: App<Element>): void {
  // Eagerly import all Vue components under UIKit
  const components: Record<string, { default: Component }> = import.meta.glob('./**/*.vue', {
    eager: true
  })

  for (const path in components) {
    const component = components[path].default
    if (!component) continue

    // Extract component name from file path (e.g., Button.vue → Button)
    const fileName = path
      .split('/')
      .pop()
      ?.replace(/\.vue$/, '')
      ?.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase() // kebab case

    if (!fileName) continue

    // Register globally as <ui-kit:button />
    const tagName = `ui-kit:${fileName}`
    app.component(tagName, component)
  }
}

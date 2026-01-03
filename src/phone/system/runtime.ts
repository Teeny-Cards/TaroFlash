import type { AppController, PhoneApp, PhoneContext } from './types'

export function createPhoneRuntime(apps: PhoneApp[], ctx: PhoneContext) {
  const controllers: Record<string, any> = {}

  for (const app of apps) {
    if (app.controller) {
      const controller = app.controller(ctx)
      controllers[app.id] = controller
      controller.setup?.()
    }
  }

  function getController<T extends AppController = AppController>(appId: string): T {
    return controllers[appId]
  }

  return {
    getController
  }
}

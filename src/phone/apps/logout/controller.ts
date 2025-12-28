import { type PhoneContext } from '@/phone/system/types'
import { useAlert } from '@/composables/alert'
import { useSessionStore } from '@/stores/session'

export function createLogoutController(ctx: PhoneContext) {
  const alert = useAlert()
  const session = useSessionStore()
  const { t } = ctx

  function run() {
    const { response } = alert.warn({
      title: t('phone.apps.logout.title'),
      message: t('phone.apps.logout.description'),
      confirmLabel: t('common.logout'),
      cancelAudio: 'ui.digi_powerdown',
      confirmAudio: 'ui.toggle_off'
    })

    response.then((result: boolean) => {
      if (result) {
        session.logout()
      }
    })
  }

  return { run }
}

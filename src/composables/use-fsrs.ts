import { DateTime } from 'luxon'
import { type Grade, type RecordLog } from 'ts-fsrs'
import { useI18n } from 'vue-i18n'

export function useRatingFormat() {
  const { t } = useI18n()

  function getRatingTimeFormat(
    grade: Grade,
    options?: RecordLog,
    style: 'long' | 'short' = 'long'
  ) {
    const date = options?.[grade].card.due
    if (!date) return ''

    const timeString = DateTime.fromJSDate(date).toRelative({ style })
    return t('study.study-again', { time: timeString })
  }

  return { getRatingTimeFormat }
}

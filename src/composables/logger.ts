import { ref } from 'vue'

const LEVELS: { [key: string]: number } = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
}

type Log = {
  message: string
  log_type: string
  timestamp: string
  trace: string
  payload?: any
}

declare global {
  interface Window {
    logs: Log[]
  }
}

let log_level = ref(Number(import.meta.env.VITE_LOG_LEVEL))

export function useLogger() {
  function setLogLevel(level: number): void {
    if (level < 0 || level > 4) {
      throw new Error('Invalid log level')
    }

    log_level.value = level
  }

  function info(message: string, payload?: any): void {
    _log('info', message, payload)
  }

  function warn(message: string, payload?: any): void {
    _log('warn', message, payload)
  }

  function error(message: string, payload?: any): void {
    _log('error', message, payload)
  }

  function debug(message: string, payload?: any): void {
    _log('debug', message, payload)
  }

  function _log(log_type: string, message: string, payload?: any): void {
    if (!window.logs) {
      window.logs = []
    }

    const callerTrace = _getCallerTrace()
    const formattedMessage = `${callerTrace} - ${message}`

    window.logs.push({
      message: message,
      log_type,
      timestamp: new Date().toISOString(),
      trace: callerTrace,
      payload
    })

    if (LEVELS[log_type] <= log_level.value) {
      ;(console as any)[log_type]?.(`[${log_type}] ${formattedMessage}`)
    }
  }

  function _getCallerTrace(skipFile = 'logger.ts'): string {
    const stack = new Error().stack
    if (!stack) return 'unknown'

    const lines = stack.split('\n')

    for (const line of lines) {
      if (!line.includes(skipFile)) {
        const match = line.match(/\(?([^\s)]+:\d+:\d+)\)?$/)
        if (match?.[1]) {
          let url = match[1]

          // Remove protocol + host (e.g. http://localhost:5173/)
          url = url.replace(/^https?:\/\/[^/]+\/?/, '')

          // Remove query params like ?t=...
          url = url.replace(/\?.*?(?=:)/, '')

          // Remove leading src/ if present
          url = url.replace(/^src\//, '')

          return url
        }
      }
    }

    return 'unknown'
  }

  return {
    setLogLevel,
    info,
    warn,
    error,
    debug
  }
}

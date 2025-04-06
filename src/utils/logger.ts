const LOGGERS: { [key: number]: ((message: string) => void) | undefined } = {
  0: () => {},
  1: console.error,
  2: console.warn,
  3: console.info,
  4: console.debug
}

const LEVEL: { [key: number]: string } = {
  0: 'none',
  1: 'error',
  2: 'warn',
  3: 'info',
  4: 'debug'
}

type Log = {
  message: string
  level: number
  timestamp: string
  trace: string
}

declare global {
  interface Window {
    logs: Log[]
  }
}

export default class Logger {
  static log_level: number = 0

  static setLogLevel(level: number = 0): void {
    if (level < 0 || level > 4) {
      throw new Error('Invalid log level')
    }

    this.log_level = level
  }

  static info(message: string): void {
    this._log(message, 3)
  }

  static warn(message: string): void {
    this._log(message, 2)
  }

  static error(message: string): void {
    this._log(message, 1)
  }

  static debug(message: string): void {
    this._log(message, 4)
  }

  private static _log(message: string, level: number = 0): void {
    if (!window.logs) {
      window.logs = []
    }

    const callerTrace = this._getCallerTrace()
    const formattedMessage = `${callerTrace} - ${message}`

    window.logs.push({
      message: message,
      level,
      timestamp: new Date().toISOString(),
      trace: callerTrace
    })

    if (level <= this.log_level) {
      LOGGERS[level]?.(`[${LEVEL[level]}] ${formattedMessage}`)
    }
  }

  private static _getCallerTrace(skipFile = 'logger.ts'): string {
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
}

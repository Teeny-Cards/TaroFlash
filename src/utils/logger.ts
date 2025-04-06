const LOG_LEVELS: { [key: number]: (message: string) => void } = {
  0: () => {},
  1: console.error,
  2: console.warn,
  3: console.info,
  4: console.debug
}

export default class Logger {
  static logs: string[] = []
  static log_level: number = Number(process.env.LOG_LEVEL) ?? 0

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
    if (level > this.log_level) return

    this.logs.push(message)
    const console_log = LOG_LEVELS[level]

    console_log?.(message)
  }
}

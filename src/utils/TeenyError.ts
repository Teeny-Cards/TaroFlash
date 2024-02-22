import ErrorMap from './errorMap'

export class TeenyError extends Error {
  name: TeenyErrorName
  originalMessage?: string
  errorCode?: string
  timestamp: string
  severity: TeenyErrorSeverity

  constructor(
    message: string,
    additionalInfo?: {
      name?: TeenyErrorName
      errorCode?: string
      stack?: string
      originalMessage?: string
      severity?: TeenyErrorSeverity
    }
  ) {
    super(message)

    this.name = additionalInfo?.name ?? 'CustomError'
    this.message = message
    this.originalMessage = additionalInfo?.originalMessage
    this.errorCode = additionalInfo?.errorCode ?? this.errorCode
    this.timestamp = new Date().toISOString()
    this.stack = additionalInfo?.stack ?? this.stack
    this.severity = additionalInfo?.severity ?? 'error'

    this.logSevereError()
  }

  static fromError(error: any): TeenyError {
    if (error instanceof TeenyError) {
      return error
    }

    const errorInfo = ErrorMap[error.code] || {
      name: 'OtherError',
      message: 'An unknown error occurred, please try again.',
      severity: 'error'
    }

    if (errorInfo.name === 'OtherError') {
      console.error(error)
    }

    return new TeenyError(errorInfo.message, {
      name: errorInfo.name,
      errorCode: error.code,
      stack: error.stack,
      originalMessage: error.message,
      severity: errorInfo.severity
    })
  }

  logSevereError() {
    if (this.severity === 'severe' || this.severity === 'error') {
      console.error(this.message)
    }
  }
}

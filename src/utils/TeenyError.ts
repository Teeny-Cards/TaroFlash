type TeenyErrorName =
  | 'UnknownError'
  | 'ObjectNotFoundError'
  | 'QuotaExceededError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'RequestTimeoutError'
  | 'FileSizeMismatchError'
  | 'GenericFirestoreError'
  | 'ResourceConflictError'
  | 'ResourceLimitError'
  | 'TemporaryServerError'
  | 'BackendUnavailableError'
  | 'DataLossError'
  | 'OtherError'
  | 'CustomError'

type TeenyErrorMessage = {
  name: TeenyErrorName
  message: string
  severity: 'error' | 'warning' | 'info' | 'severe'
}

export class TeenyError extends Error {
  name: TeenyErrorName
  originalMessage?: string
  errorCode?: string
  timestamp: string

  constructor(
    message: string,
    additionalInfo?: {
      name?: TeenyErrorName
      errorCode?: string
      stack?: string
      originalMessage?: string
    }
  ) {
    super(message)

    this.name = additionalInfo?.name ?? 'CustomError'
    this.originalMessage = additionalInfo?.originalMessage || 'No original message'
    this.errorCode = additionalInfo?.errorCode
    this.timestamp = new Date().toISOString()
    this.stack = additionalInfo?.stack
  }

  static fromError(error: any): TeenyError {
    const errorInfo = firebaseErrorMessages[error.code] || {
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
      originalMessage: error.message
    })
  }
}

//TODO: Make error messages user friendly before deployment
const databaseErrorMessages: Record<string, TeenyErrorMessage> = {
  'storage/unknown': {
    name: 'UnknownError',
    message: 'An unknown error occurred, please try again.',
    severity: 'error'
  },
  'storage/object-not-found': {
    name: 'ObjectNotFoundError',
    message: 'There was no image to delete',
    severity: 'error'
  },
  'storage/quota-exceeded': {
    name: 'QuotaExceededError',
    message: 'quota exceeded',
    severity: 'error'
  },
  'storage/unauthenticated': {
    name: 'AuthenticationError',
    message: "Oops you're actually logged out",
    severity: 'error'
  },
  'storage/unauthorized': {
    name: 'AuthorizationError',
    message: "You don't have access to do that",
    severity: 'error'
  },
  'storage/retry-limit-exceeded': {
    name: 'RequestTimeoutError',
    message: 'The request took too long',
    severity: 'error'
  },
  'storage/server-file-wrong-size': {
    name: 'FileSizeMismatchError',
    message: 'File too big',
    severity: 'warning'
  }
}

const firestoreErrorMessages: Record<string, TeenyErrorMessage> = {
  unknown: { name: 'UnknownError', message: '', severity: 'error' },
  'deadline-exceeded': {
    name: 'RequestTimeoutError',
    message: 'Try refreshing the page. If the problem persists, please contact us.',
    severity: 'error'
  },
  'not-found': {
    name: 'ObjectNotFoundError',
    message: "We couldn't find the item you're looking for",
    severity: 'error'
  },
  'already-exists': {
    name: 'ResourceConflictError',
    message: 'Oops that already exists',
    severity: 'error'
  },
  'permission-denied': {
    name: 'AuthorizationError',
    message: "You don't have access to do that",
    severity: 'error'
  },
  'resource-exhausted': {
    name: 'ResourceLimitError',
    message: 'Not enough space',
    severity: 'error'
  },
  'failed-precondition': {
    name: 'TemporaryServerError',
    message: 'Try again later',
    severity: 'error'
  },
  aborted: { name: 'GenericFirestoreError', message: 'race condition', severity: 'info' },
  internal: {
    name: 'BackendUnavailableError',
    message: 'server error, nothing to do but wait',
    severity: 'severe'
  },
  unavailable: { name: 'BackendUnavailableError', message: 'backend is down', severity: 'error' },
  'data-loss': { name: 'DataLossError', message: 'some data was lost', severity: 'severe' },
  unauthenticated: {
    name: 'AuthenticationError',
    message: "Oops you're actually logged out",
    severity: 'error'
  },
  'invalid-argument': {
    name: 'OtherError',
    message: 'You just found a bug, please contact us. Error: invalid-argument',
    severity: 'error'
  }
}

const firebaseErrorMessages: Record<string, TeenyErrorMessage> = {
  ...databaseErrorMessages,
  ...firestoreErrorMessages
}

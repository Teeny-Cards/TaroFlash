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

type TeenyErrorMessage = {
  name: TeenyErrorName
  message: string
  severity: 'error' | 'warning' | 'info' | 'severe'
}

export class TeenyError extends Error {
  originalMessage: string
  errorCode: string
  timestamp: string

  constructor(error: any, additionalInfo = {}) {
    const errorInfo = firebaseErrorMessages[error.code] || {
      name: 'other',
      message: 'An unknown error occurred, please try again.'
    }

    super(errorInfo.message)

    this.name = errorInfo.name
    this.originalMessage = error.message || 'No original message'
    this.errorCode = error.code
    this.timestamp = new Date().toISOString()

    if (error.stack) {
      this.stack = error.stack
    }

    Object.assign(this, additionalInfo)
  }
}

const databaseErrorMessages: Record<string, TeenyErrorMessage> = {
  'storage/unknown': {
    name: 'UnknownError',
    message: 'An unknown error occurred, please try again.',
    severity: 'error'
  },
  'storage/object-not-found': { name: 'ObjectNotFoundError', message: '', severity: 'error' },
  'storage/quota-exceeded': { name: 'QuotaExceededError', message: '', severity: 'error' },
  'storage/unauthenticated': { name: 'AuthenticationError', message: '', severity: 'error' },
  'storage/unauthorized': { name: 'AuthorizationError', message: '', severity: 'error' },
  'storage/retry-limit-exceeded': {
    name: 'RequestTimeoutError',
    message: 'The request took too long',
    severity: 'error'
  },
  'storage/server-file-wrong-size': {
    name: 'FileSizeMismatchError',
    message: '',
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
  'not-found': { name: 'ObjectNotFoundError', message: '', severity: 'error' },
  'already-exists': { name: 'ResourceConflictError', message: '', severity: 'error' },
  'permission-denied': { name: 'AuthorizationError', message: '', severity: 'error' },
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
  unauthenticated: { name: 'AuthenticationError', message: '', severity: 'error' }
}

const firebaseErrorMessages: Record<string, TeenyErrorMessage> = {
  ...databaseErrorMessages,
  ...firestoreErrorMessages
}

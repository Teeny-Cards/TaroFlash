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

type TeenyError = Error & {
  name: TeenyErrorName
  message: string
  originalMessage?: string
  errorCode?: string
  timestamp: string
  stack?: string
}
